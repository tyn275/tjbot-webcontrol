import { useState, useCallback, useEffect, useRef } from 'react'
import { dispatchRobotCommand, subscribeMqttMessage } from '../../../services/mqtt/mqtt-client'
import { HARDWARE_LIMITS, truncateTtsText } from '../../../core/hardware-limits'
import { buildTtsCommand, buildSilentCommand } from '../audio.commands'
import { estimateTtsDurationMs, isPlaybackFinishedMessage, countWords } from '../audio.utils'
import { VOICE_DATA, type TtsLanguage, type TtsService } from '../audio.types'

type CleanupFn = () => void

// Khởi chạy bộ lắng nghe sự kiện MQTT và đồng hồ dự phòng cho tác vụ đọc văn bản
const startTtsWatcher = (botId: string, durationMs: number, onStop: () => void): CleanupFn => {
  const timer = setTimeout(() => {
    cleanup()
    onStop()
  }, durationMs)

  const unsubscribe = subscribeMqttMessage((topic, payload) => {
    if (topic === `${botId}/status` && isPlaybackFinishedMessage(payload)) {
      cleanup()
      onStop()
    }
  })

  const cleanup = () => {
    clearTimeout(timer)
    unsubscribe()
  }
  return cleanup
}

// Bắn lệnh MQTT với cơ chế kiểm tra kết nối và ghi log
const dispatchTts = (botId: string, cmd: string, isConnected: boolean): boolean => {
  return dispatchRobotCommand(botId, cmd, isConnected)
}

// Hook con quản lý chuỗi văn bản nhập vào và giới hạn số từ tối đa
const useTtsTextState = (lang: TtsLanguage) => {
  const [text, setText] = useState('')
  const handleText = useCallback(
    (val: string) => {
      setText(countWords(val, lang) > HARDWARE_LIMITS.TTS_MAX_WORDS ? truncateTtsText(val) : val)
    },
    [lang]
  )
  return {
    text,
    setText: handleText,
    wordCount: countWords(text, lang),
    isOverLimit: countWords(text, lang) > HARDWARE_LIMITS.TTS_MAX_WORDS,
  }
}

// Hook con quản lý cấu hình quốc gia, giọng đọc và dịch vụ tổng hợp
const useTtsVoiceConfig = () => {
  const [lang, setLang] = useState<TtsLanguage>('vi')
  const [voice, setVoice] = useState('vi-VN-Standard-A')
  const [service, setService] = useState<TtsService>('Google')

  const handleLang = useCallback((newLang: TtsLanguage) => {
    setLang(newLang)
    setVoice(VOICE_DATA[newLang][0]?.value ?? '')
  }, [])

  return { lang, voice, service, setVoice, setService, setLang: handleLang }
}

// Hook con quản lý vòng đời hoạt ảnh đọc văn bản
const useTtsPlayer = (botId: string) => {
  const [isReading, setIsReading] = useState(false)
  const cleanupRef = useRef<CleanupFn | null>(null)

  const stopActive = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setIsReading(false)
  }, [])

  useEffect(() => () => stopActive(), [stopActive])

  const play = useCallback(
    (durationMs: number) => {
      stopActive()
      setIsReading(true)
      cleanupRef.current = startTtsWatcher(botId, durationMs, stopActive)
    },
    [botId, stopActive]
  )

  return { isReading, play, stopActive }
}

interface ActionParams {
  readonly botId: string
  readonly isConnected: boolean
  readonly player: ReturnType<typeof useTtsPlayer>
  readonly setLastCmd: (cmd: string) => void
}

// Hook con điều phối hành động phát giọng nói và ngắt âm thanh
const useTtsActions = (
  params: ActionParams,
  config: ReturnType<typeof useTtsVoiceConfig>,
  text: string
) => {
  const speak = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    const cmd = buildTtsCommand({ text: trimmed, ...config })
    params.setLastCmd(cmd)
    if (!dispatchTts(params.botId, cmd, params.isConnected)) return
    params.player.play(estimateTtsDurationMs(trimmed, config.lang))
  }, [params, config, text])

  const silent = useCallback(() => {
    params.player.stopActive()
    params.setLastCmd(buildSilentCommand())
    dispatchTts(params.botId, buildSilentCommand(), params.isConnected)
  }, [params])

  return { speak, silent }
}

// Hook quản lý trạng thái văn bản, chọn ngôn ngữ và giọng đọc chuyển đổi TTS
export const useAudioTts = (botId: string, isConnected = false) => {
  const config = useTtsVoiceConfig()
  const textState = useTtsTextState(config.lang)
  const player = useTtsPlayer(botId)
  const [lastCommand, setLastCommand] = useState('')
  const actions = useTtsActions(
    { botId, isConnected, player, setLastCmd: setLastCommand },
    config,
    textState.text
  )

  return { ...textState, ...config, isReading: player.isReading, lastCommand, ...actions }
}
