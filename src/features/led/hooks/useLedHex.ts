import { useState, useCallback } from 'react'
import { resolveColorName } from '../led.commands'
import { useLedActions } from './useLedActions'

const formatHexInput = (raw: string): string => {
  const clean = raw.trim().toUpperCase()
  return (clean.startsWith('#') ? clean : `#${clean}`).slice(0, 7)
}

const useLedState = () => {
  const [hexColor, setHexColor] = useState<string>('#A020F0')
  const [blinkTimes, setBlinkTimes] = useState<number>(5)
  const [blinkSpeed, setBlinkSpeed] = useState<'fast' | 'slow'>('fast')

  const handleHexChange = useCallback((raw: string) => {
    setHexColor(formatHexInput(raw))
  }, [])

  return { hexColor, blinkTimes, blinkSpeed, setBlinkTimes, setBlinkSpeed, handleHexChange }
}

export const useLedHex = (botId: string, isConnected = false) => {
  const state = useLedState()
  const actions = useLedActions({
    botId,
    hex: state.hexColor,
    times: state.blinkTimes,
    speed: state.blinkSpeed,
    isConnected,
  })

  return {
    ...state,
    colorName: resolveColorName(state.hexColor),
    ...actions,
  }
}
