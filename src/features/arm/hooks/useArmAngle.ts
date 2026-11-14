import { useState, useRef, useCallback } from 'react'
import { HARDWARE_LIMITS, clampArmAngle } from '../../../core/hardware-limits'
import { publishRobotCommand } from '../../../services/mqtt/mqtt-client'
import { logCommandSent, logCommandError } from '../../../services/logger/log.service'
import { buildArmCommand } from '../arm.commands'

interface AngleParams {
  readonly botId: string
  readonly isConnected: boolean
  readonly onEnsureMuscle: () => void
}

// Bắn lệnh quay servo cánh tay qua giao thức MQTT
const emit = (cmd: string, botId: string, isConnected: boolean): void => {
  if (!isConnected) return logCommandError(cmd)
  logCommandSent(botId, cmd)
  publishRobotCommand(botId, cmd)
}

// Điều tiết tần suất gửi lệnh góc quay theo thời gian thực nhằm tránh nghẽn MQTT
const useThrottleDispatch = (followMe: boolean, send: (target: number) => void) => {
  const lastSent = useRef(0)
  return useCallback(
    (val: number) => {
      const now = performance.now()
      if (followMe && now - lastSent.current >= HARDWARE_LIMITS.ARM_REALTIME_THROTTLE_MS) {
        lastSent.current = now
        send(val)
      }
    },
    [followMe, send]
  )
}

// Tạo hàm phát lệnh quay góc cánh tay có đảm bảo bật cơ bắp
const useAngleDispatcher = (botId: string, isConnected: boolean, onEnsure: () => void) => {
  return useCallback(
    (target: number) => {
      onEnsure()
      emit(buildArmCommand(clampArmAngle(target)), botId, isConnected)
    },
    [botId, isConnected, onEnsure]
  )
}

// Hook quản lý góc quay servo cánh tay và chế độ bám theo thời gian thực
export const useArmAngle = ({ botId, isConnected, onEnsureMuscle }: AngleParams) => {
  const [angle, setAngle] = useState(0)
  const [followMe, setFollowMe] = useState(false)
  const dispatchAngle = useAngleDispatcher(botId, isConnected, onEnsureMuscle)
  const throttleSend = useThrottleDispatch(followMe, dispatchAngle)

  const updateAngle = useCallback(
    (next: number) => {
      const clamped = clampArmAngle(next)
      setAngle(clamped)
      throttleSend(clamped)
    },
    [throttleSend]
  )

  const commitAngle = useCallback(() => {
    if (followMe) dispatchAngle(angle)
  }, [followMe, dispatchAngle, angle])

  return { angle, followMe, setFollowMe, updateAngle, commitAngle, dispatchAngle }
}
