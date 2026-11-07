import { useState, useCallback, useEffect } from 'react'
import { i18n } from '../../../i18n/i18n'
import { postRobotCommand } from '../../../services/api/api-client'
import { logCommandSent, logCommandError } from '../../../services/logger/log.service'
import { buildRainbowCommand, buildLedOffCommand } from '../led.commands'

const delayMs = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const sendEffectTransition = async (botId: string, effect: string): Promise<void> => {
  const offCmd = buildLedOffCommand()
  await postRobotCommand(botId, offCmd)
  await delayMs(60)
  const rainbowCmd = buildRainbowCommand(effect)
  await postRobotCommand(botId, rainbowCmd)
  logCommandSent(botId, rainbowCmd)
}

const sendStopEffect = async (botId: string): Promise<void> => {
  const offCmd = buildLedOffCommand()
  await postRobotCommand(botId, offCmd)
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
      if (!isConnected) return logCommandError(i18n.t('led.disconnectedWarning'))
      await sendEffectTransition(botId, eff)
      setActiveEffect(eff)
    },
    [botId, isConnected]
  )

  const turnOff = useCallback(async () => {
    if (!isConnected) return logCommandError(i18n.t('led.disconnectedWarning'))
    await sendStopEffect(botId)
    setActiveEffect(null)
  }, [botId, isConnected])

  return { activeEffect, triggerEffect, turnOff }
}
