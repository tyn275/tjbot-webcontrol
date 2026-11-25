import { useState, useCallback, useEffect, useRef, type MutableRefObject } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { buildRecordCommand } from '../mic.commands'
import { clampMicTimeout } from '../mic.utils'

type CleanupFn = () => void

// Khởi chạy bộ đếm thời gian dự phòng ngắt ghi âm
const startRecordTimer = (durationMs: number, onTimeout: () => void): CleanupFn => {
  const timer = setTimeout(onTimeout, durationMs)
  return () => clearTimeout(timer)
}

// Gửi lệnh ghi âm với cơ chế kiểm tra kết nối và ghi nhật ký
const dispatchRecord = (botId: string, cmd: string, isConnected: boolean): boolean => {
  return dispatchRobotCommand(botId, cmd, isConnected)
}

interface RecordDeps {
  readonly botId: string
  readonly isConnected: boolean
  readonly cleanupRef: MutableRefObject<CleanupFn | null>
  readonly setRecording: (val: boolean) => void
}

const useRecordStop = (deps: RecordDeps) => {
  return useCallback(() => {
    deps.cleanupRef.current?.()
    deps.cleanupRef.current = null
    const ok = dispatchRecord(deps.botId, buildRecordCommand('off'), deps.isConnected)
    if (ok) {
      deps.setRecording(false)
    }
  }, [deps])
}

const useRecordStart = (deps: RecordDeps, timeout: number) => {
  return useCallback(() => {
    deps.cleanupRef.current?.()
    const sec = clampMicTimeout(timeout)
    const cmd = buildRecordCommand('on', sec)
    if (!dispatchRecord(deps.botId, cmd, deps.isConnected)) return
    deps.setRecording(true)
    deps.cleanupRef.current = startRecordTimer(sec * 1000 + 1000, () => deps.setRecording(false))
  }, [deps, timeout])
}

// Hook quản lý tác vụ thu âm và nói nhại lại qua loa robot
export const useMicRecord = (botId: string, isConnected = false) => {
  const [timeout, setTimeoutVal] = useState(5)
  const [isRecording, setIsRecording] = useState(false)
  const cleanupRef = useRef<CleanupFn | null>(null)
  useEffect(() => () => cleanupRef.current?.(), [])
  const deps: RecordDeps = { botId, isConnected, cleanupRef, setRecording: setIsRecording }
  const stopRecord = useRecordStop(deps)
  const startRecord = useRecordStart(deps, timeout)

  return { timeout, setTimeoutVal, isRecording, startRecord, stopRecord }
}
