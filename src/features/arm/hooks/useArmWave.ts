import { useState, useCallback } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { buildWavehandCommand, buildStopWaveCommand, type WaveSpeed } from '../arm.commands'

interface WaveParams {
  readonly botId: string
  readonly isConnected: boolean
  readonly onEnsureMuscle: () => void
}

// Bắn lệnh MQTT ra ngoài mạng và ghi nhật ký hệ thống
const emit = (cmd: string, botId: string, isConnected: boolean): void => {
  dispatchRobotCommand(botId, cmd, isConnected)
}

// Hook quản lý trạng thái và thao tác phát lệnh kịch bản vẫy tay
export const useArmWave = ({ botId, isConnected, onEnsureMuscle }: WaveParams) => {
  const [times, setTimes] = useState(1)
  const [speed, setSpeed] = useState<WaveSpeed>('fast')
  const [commandLog, setCommandLog] = useState('Wavehand("fast", 1)')

  const wave = useCallback(() => {
    onEnsureMuscle()
    const safeTimes = Math.max(1, Math.min(times, 20))
    const cmd = buildWavehandCommand(speed, safeTimes)
    setCommandLog(cmd)
    emit(cmd, botId, isConnected)
  }, [botId, isConnected, onEnsureMuscle, speed, times])

  const stop = useCallback(() => {
    const cmd = buildStopWaveCommand()
    setCommandLog(cmd)
    emit(cmd, botId, isConnected)
  }, [botId, isConnected])

  return { times, setTimes, speed, setSpeed, commandLog, wave, stop }
}
