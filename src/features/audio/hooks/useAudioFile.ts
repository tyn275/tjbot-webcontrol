import { useState, useCallback, useEffect, useRef } from 'react'
import { dispatchRobotCommand, subscribeMqttMessage } from '../../../services/mqtt/mqtt-client'
import { buildPlayAudioCommand, buildSilentCommand } from '../audio.commands'
import { getAudioFileDurationMs, isPlaybackFinishedMessage } from '../audio.utils'

type CleanupFn = () => void

// Khởi chạy bộ lắng nghe sự kiện MQTT và đồng hồ dự phòng cho tác vụ phát file
const startFileWatcher = (botId: string, durationMs: number, onStop: () => void): CleanupFn => {
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

// Hook con theo dõi trạng thái phát và điều phối tự ngắt hoạt ảnh
const useAudioWatcher = (botId: string, file: string, isConnected: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const cleanupRef = useRef<CleanupFn | null>(null)

  const stopActive = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setIsPlaying(false)
  }, [])

  useEffect(() => () => stopActive(), [botId, stopActive])

  const playFile = useCallback(() => {
    const cmd = buildPlayAudioCommand(file)
    if (!isConnected) return void dispatchRobotCommand(botId, cmd, false)
    stopActive()
    if (!dispatchRobotCommand(botId, cmd)) return
    setIsPlaying(true)
    cleanupRef.current = startFileWatcher(botId, getAudioFileDurationMs(file), stopActive)
  }, [botId, isConnected, file, stopActive])

  return { isPlaying, playFile, stopActive }
}

// Hook quản lý trạng thái chọn file và kích hoạt phát âm thanh có sẵn
export const useAudioFile = (botId: string, isConnected = false) => {
  const [selectedFile, setSelectedFile] = useState('hello.mp3')
  const { isPlaying, playFile, stopActive } = useAudioWatcher(botId, selectedFile, isConnected)

  const silent = useCallback(() => {
    stopActive()
    const cmd = buildSilentCommand()
    dispatchRobotCommand(botId, cmd, isConnected)
  }, [botId, isConnected, stopActive])

  return { selectedFile, isPlaying, setSelectedFile, playFile, silent }
}
