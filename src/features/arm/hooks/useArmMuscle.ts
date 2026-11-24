import { useState, useCallback } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { buildMuscleCommand, type MuscleState } from '../arm.commands'

interface MuscleParams {
  readonly botId: string
  readonly isConnected: boolean
}

// Gửi lệnh đóng/ngắt cơ bắp servo cánh tay qua kết nối MQTT
const emitMuscle = (state: MuscleState, botId: string, isConnected: boolean): void => {
  const cmd = buildMuscleCommand(state)
  dispatchRobotCommand(botId, cmd, isConnected)
}

// Hook quản lý trạng thái kích hoạt cơ bắp servo cánh tay
export const useArmMuscle = ({ botId, isConnected }: MuscleParams) => {
  const [muscle, setMuscle] = useState<MuscleState>('on')

  const sendMuscle = useCallback(
    (next: MuscleState) => {
      setMuscle(next)
      emitMuscle(next, botId, isConnected)
    },
    [botId, isConnected]
  )

  const ensureMuscleOn = useCallback(() => {
    if (muscle !== 'on') sendMuscle('on')
  }, [muscle, sendMuscle])

  return { muscle, sendMuscle, ensureMuscleOn }
}
