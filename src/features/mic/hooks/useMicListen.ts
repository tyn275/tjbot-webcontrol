import { useState, useCallback, useEffect, useRef, type MutableRefObject } from 'react'
import { dispatchRobotCommand, subscribeMqttMessage } from '../../../services/mqtt/mqtt-client'
import { buildListenCommand } from '../mic.commands'
import { clampMicTimeout, parseSpeechResult } from '../mic.utils'
import type { MicLanguage } from '../mic.types'

type CleanupFn = () => void

interface WatcherConfig {
  readonly botId: string
  readonly timeoutMs: number
  readonly onResult: (text: string) => void
  readonly onTimeout: () => void
}

// Lắng nghe kết quả Speech-to-Text từ robot qua MQTT kèm đồng hồ dự phòng
const startListenWatcher = (config: WatcherConfig): CleanupFn => {
  const timer = setTimeout(() => {
    cleanup()
    config.onTimeout()
  }, config.timeoutMs)

  const unsubscribe = subscribeMqttMessage((topic, payload) => {
    if (topic === `${config.botId}/status`) {
      const res = parseSpeechResult(payload)
      if (res !== null) {
        cleanup()
        config.onResult(res)
      }
    }
  })

  const cleanup = () => {
    clearTimeout(timer)
    unsubscribe()
  }
  return cleanup
}

// Hook con quản lý các trạng thái nhập liệu và kết quả nhận diện
const useListenState = () => {
  const [timeout, setTimeoutVal] = useState(5)
  const [lang, setLang] = useState<MicLanguage>('vi-VN')
  const [s2tOutput, setS2tOutput] = useState('')
  const [lastCommand, setLastCommand] = useState('')
  const [isListening, setIsListening] = useState(false)

  return {
    timeout,
    setTimeoutVal,
    lang,
    setLang,
    s2tOutput,
    setS2tOutput,
    lastCommand,
    setLastCommand,
    isListening,
    setIsListening,
  }
}

interface ActionDeps {
  readonly botId: string
  readonly isConnected: boolean
  readonly state: ReturnType<typeof useListenState>
  readonly cleanupRef: MutableRefObject<CleanupFn | null>
}

const useListenStop = (deps: ActionDeps) => {
  return useCallback(() => {
    deps.cleanupRef.current?.()
    deps.cleanupRef.current = null
    const cmd = buildListenCommand('off')
    deps.state.setLastCommand(cmd)
    const ok = dispatchRobotCommand(deps.botId, cmd, deps.isConnected)
    if (ok) {
      deps.state.setIsListening(false)
    }
  }, [deps])
}

const triggerListenWatcher = (deps: ActionDeps, sec: number) => {
  const timeoutMs = sec * 1000 + 4000
  const onResult = (t: string) => {
    deps.state.setS2tOutput(t)
    deps.state.setIsListening(false)
  }
  deps.cleanupRef.current = startListenWatcher({
    botId: deps.botId,
    timeoutMs,
    onResult,
    onTimeout: () => deps.state.setIsListening(false),
  })
}

const useListenStart = (deps: ActionDeps) => {
  return useCallback(() => {
    deps.cleanupRef.current?.()
    const sec = clampMicTimeout(deps.state.timeout)
    const cmd = buildListenCommand('on', sec, deps.state.lang)
    deps.state.setLastCommand(cmd)
    deps.state.setS2tOutput('')
    if (!dispatchRobotCommand(deps.botId, cmd, deps.isConnected)) return
    deps.state.setIsListening(true)
    triggerListenWatcher(deps, sec)
  }, [deps])
}

// Hook quản lý tác vụ lắng nghe nhận diện giọng nói AI và hiển thị văn bản
export const useMicListen = (botId: string, isConnected = false) => {
  const state = useListenState()
  const cleanupRef = useRef<CleanupFn | null>(null)
  useEffect(() => () => cleanupRef.current?.(), [])
  const deps: ActionDeps = { botId, isConnected, state, cleanupRef }
  const startListen = useListenStart(deps)
  const stopListen = useListenStop(deps)

  return { ...state, startListen, stopListen }
}
