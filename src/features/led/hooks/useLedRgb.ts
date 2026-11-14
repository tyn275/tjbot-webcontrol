import { useState, useCallback } from 'react'
import { rgbToHex, resolveColorName } from '../led.commands'
import { useLedActions } from './useLedActions'
import type { RgbValues } from '../components/RgbInputGroup'

const useRgbState = () => {
  const [rgb, setRgb] = useState<RgbValues>({ r: 0, g: 255, b: 0 })
  const [blinkTimes, setBlinkTimes] = useState<number>(5)
  const [blinkSpeed, setBlinkSpeed] = useState<'fast' | 'slow'>('fast')

  const handleRgbChange = useCallback((channel: 'r' | 'g' | 'b', val: number) => {
    setRgb((prev) => ({ ...prev, [channel]: val }))
  }, [])

  return { rgb, blinkTimes, blinkSpeed, setBlinkTimes, setBlinkSpeed, handleRgbChange }
}

export const useLedRgb = (botId: string, isConnected = false) => {
  const state = useRgbState()
  const hexColor = rgbToHex(state.rgb.r, state.rgb.g, state.rgb.b)
  const actions = useLedActions({
    botId,
    hex: hexColor,
    times: state.blinkTimes,
    speed: state.blinkSpeed,
    isConnected,
  })

  return {
    ...state,
    hexColor,
    colorName: resolveColorName(hexColor),
    ...actions,
  }
}
