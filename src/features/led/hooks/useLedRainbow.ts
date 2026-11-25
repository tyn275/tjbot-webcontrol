import { useState, useCallback, useEffect } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { logCommandError } from '../../../services/logger/log.service'
import { buildRainbowCommand, buildLedOffCommand } from '../led.commands'

const sendRainbowEffect = (botId: string, effect: string): boolean => {
  return dispatchRobotCommand(botId, buildRainbowCommand(effect))
}

const sendStopEffect = (botId: string): void => {
  dispatchRobotCommand(botId, buildLedOffCommand())
}

const useSyncDisconnected = (isConnected: boolean, onReset: () => void): void => {
  useEffect(() => {
    if (!isConnected) onReset()
  }, [isConnected, onReset])
}

export const useLedRainbow = (botId: string, isConnected = false) => {
  const [activeEffect, setActiveEffect] = useState<string | null>(null)
  const resetEffect = useCallback(() => setActiveEffect(null), [])
  useSyncDisconnected(isConnected, resetEffect)

  const triggerEffect = useCallback(
    (eff: string) => {
      if (!isConnected) return logCommandError(buildRainbowCommand(eff))
      if (sendRainbowEffect(botId, eff)) setActiveEffect(eff)
    },
    [botId, isConnected]
  )

  const turnOff = useCallback(() => {
    if (!isConnected) return logCommandError(buildLedOffCommand())
    sendStopEffect(botId)
    setActiveEffect(null)
  }, [botId, isConnected])

  return { activeEffect, triggerEffect, turnOff }
}
