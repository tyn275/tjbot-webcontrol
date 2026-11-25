import { useState, useCallback, useEffect, useRef } from 'react'
import { subscribeMqttMessage } from '../../../services/mqtt/mqtt-client'
import { isPlaybackFinishedMessage } from '../audio.utils'

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

// Hook con quản lý vòng đời hoạt ảnh đọc văn bản
export const useTtsPlayer = (botId: string) => {
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
