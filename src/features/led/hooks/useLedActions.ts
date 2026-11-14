import { useCallback } from 'react'
import { publishRobotCommand } from '../../../services/mqtt/mqtt-client'
import { logCommandSent, logCommandError } from '../../../services/logger/log.service'
import { buildHeadHexCommand, buildHeadBlinkHexCommand } from '../led.commands'

export interface LedActionParams {
  readonly botId: string
  readonly hex: string
  readonly times: number
  readonly speed: 'fast' | 'slow'
  readonly isConnected: boolean
}

const dispatchCommand = (cmd: string, botId: string, isConnected: boolean): void => {
  if (!isConnected) {
    logCommandError(cmd)
    return
  }
  logCommandSent(botId, cmd)
  publishRobotCommand(botId, cmd)
}

export const useLedActions = ({ botId, hex, times, speed, isConnected }: LedActionParams) => {
  const turnOn = useCallback(() => {
    dispatchCommand(buildHeadHexCommand('on', hex), botId, isConnected)
  }, [botId, hex, isConnected])

  const turnOff = useCallback(() => {
    dispatchCommand(buildHeadHexCommand('off', 'black'), botId, isConnected)
  }, [botId, isConnected])

  const blink = useCallback(() => {
    dispatchCommand(buildHeadBlinkHexCommand(times, speed, hex), botId, isConnected)
  }, [botId, times, speed, hex, isConnected])

  return { turnOn, turnOff, blink }
}
