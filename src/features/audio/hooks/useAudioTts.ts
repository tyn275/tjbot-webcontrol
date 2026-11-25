import { useState, useCallback } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { HARDWARE_LIMITS, truncateTtsText, isCjkText } from '../../../core/hardware-limits'
import { buildTtsCommand, buildSilentCommand } from '../audio.commands'
import { estimateTtsDurationMs, countWords } from '../audio.utils'
import { VOICE_DATA, type TtsLanguage, type TtsService } from '../audio.types'
import { useTtsPlayer } from './useTtsPlayer'

const dispatchTts = (botId: string, cmd: string, isConnected: boolean): boolean => {
  return dispatchRobotCommand(botId, cmd, isConnected)
}

const truncateInputText = (val: string, lang: TtsLanguage): string => {
  const isCjk = lang === 'ja' || isCjkText(val)
  return countWords(val, lang) > HARDWARE_LIMITS.TTS_MAX_WORDS
    ? truncateTtsText(val, HARDWARE_LIMITS.TTS_MAX_WORDS, isCjk)
    : val
}

// Hook con quản lý chuỗi văn bản nhập vào, cờ cảnh báo rỗng và giới hạn số từ tối đa
const useTtsTextState = (lang: TtsLanguage) => {
  const [text, setText] = useState('')
  const [isEmptyAlert, setIsEmptyAlert] = useState(false)

  const handleText = useCallback(
    (val: string) => {
      if (val.trim()) setIsEmptyAlert(false)
      setText(truncateInputText(val, lang))
    },
    [lang]
  )
  return {
    text,
    setText: handleText,
    isEmptyAlert,
    setIsEmptyAlert,
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

interface ActionParams {
  readonly botId: string
  readonly isConnected: boolean
  readonly isOverLimit: boolean
  readonly player: ReturnType<typeof useTtsPlayer>
  readonly setLastCmd: (cmd: string) => void
  readonly onEmptySubmit: () => void
}

const useSpeakHandler = (
  params: ActionParams,
  config: ReturnType<typeof useTtsVoiceConfig>,
  text: string
) => {
  return useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) {
      params.onEmptySubmit()
      return
    }
    if (params.isOverLimit) return
    const cmd = buildTtsCommand({ text: trimmed, ...config })
    params.setLastCmd(cmd)
    if (!dispatchTts(params.botId, cmd, params.isConnected)) return
    params.player.play(estimateTtsDurationMs(trimmed, config.lang))
  }, [params, config, text])
}

// Hook con điều phối hành động phát giọng nói và ngắt âm thanh
const useTtsActions = (
  params: ActionParams,
  config: ReturnType<typeof useTtsVoiceConfig>,
  text: string
) => {
  const speak = useSpeakHandler(params, config, text)
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
    {
      botId,
      isConnected,
      isOverLimit: textState.isOverLimit,
      player,
      setLastCmd: setLastCommand,
      onEmptySubmit: () => textState.setIsEmptyAlert(true),
    },
    config,
    textState.text
  )

  return { ...textState, ...config, isReading: player.isReading, lastCommand, ...actions }
}
