import { useState, useCallback, useEffect } from 'react'
import { publishRobotCommand } from '../../../services/mqtt/mqtt-client'
import { logCommandSent, logCommandError } from '../../../services/logger/log.service'
import { buildRainbowCommand, buildLedOffCommand } from '../led.commands'

const delayMs = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const sendEffectTransition = async (botId: string, effect: string): Promise<void> => {
  const offCmd = buildLedOffCommand()
  publishRobotCommand(botId, offCmd)
  await delayMs(60)
  const rainbowCmd = buildRainbowCommand(effect)
  publishRobotCommand(botId, rainbowCmd)
  logCommandSent(botId, rainbowCmd)
}

const sendStopEffect = (botId: string): void => {
  const offCmd = buildLedOffCommand()
  publishRobotCommand(botId, offCmd)
  logCommandSent(botId, offCmd)
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
    async (eff: string) => {
      if (!isConnected) return logCommandError(buildRainbowCommand(eff))
      await sendEffectTransition(botId, eff)
      setActiveEffect(eff)
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
