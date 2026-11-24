import { useState, useCallback, useEffect } from 'react'
import { dispatchRobotCommand } from '../../../services/mqtt/mqtt-client'
import { logCommandError } from '../../../services/logger/log.service'
import { buildRainbowCommand, buildLedOffCommand } from '../led.commands'

const delayMs = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const sendEffectTransition = async (botId: string, effect: string): Promise<boolean> => {
  const offCmd = buildLedOffCommand()
  if (!dispatchRobotCommand(botId, offCmd)) return false
  await delayMs(60)
  const rainbowCmd = buildRainbowCommand(effect)
  if (!dispatchRobotCommand(botId, rainbowCmd)) return false
  return true
}

const sendStopEffect = (botId: string): void => {
  const offCmd = buildLedOffCommand()
  dispatchRobotCommand(botId, offCmd)
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
      if (await sendEffectTransition(botId, eff)) setActiveEffect(eff)
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
