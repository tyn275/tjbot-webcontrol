import { useCallback } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { clampTimes } from '../../../core/hardware-limits'
import { buildHeadHexCommand, buildHeadBlinkHexCommand, isValidHex } from '../led.commands'

export interface LedActionParams {
  readonly botId: string
  readonly hex: string
  readonly times: number
  readonly speed: 'fast' | 'slow'
  readonly isConnected: boolean
}

const dispatchCommand = (cmd: string, botId: string, isConnected: boolean): void => {
  dispatchRobotCommand(botId, cmd, isConnected)
}

export const useLedActions = ({ botId, hex, times, speed, isConnected }: LedActionParams) => {
  const turnOn = useCallback(() => {
    if (!isValidHex(hex)) return
    dispatchCommand(buildHeadHexCommand('on', hex), botId, isConnected)
  }, [botId, hex, isConnected])

  const turnOff = useCallback(() => {
    dispatchCommand(buildHeadHexCommand('off', 'black'), botId, isConnected)
  }, [botId, isConnected])

  const blink = useCallback(() => {
    if (!isValidHex(hex)) return
    const safeTimes = clampTimes(times, 1, 20)
    dispatchCommand(buildHeadBlinkHexCommand(safeTimes, speed, hex), botId, isConnected)
  }, [botId, times, speed, hex, isConnected])

  return { turnOn, turnOff, blink }
}
