import type { FC } from 'react'
import { useLedHex } from '../hooks/useLedHex'
import { ColorPickerHex } from './ColorPickerHex'
import { BlinkControl } from './BlinkControl'
import { LedSectionLayout } from './LedSectionLayout'

interface Props {
  readonly botId: string
  readonly isConnected: boolean
}

export const LedHexSection: FC<Props> = ({ botId, isConnected }) => {
  const led = useLedHex(botId, isConnected)

  return (
    <LedSectionLayout
      hexColor={led.hexColor}
      labelKey="led.led1Label"
      titleKey="led.hexSection"
      className="mb-3"
    >
      <ColorPickerHex
        hexColor={led.hexColor}
        onHexChange={led.handleHexChange}
        onTurnOn={led.turnOn}
        onTurnOff={led.turnOff}
      />
      <BlinkControl
        blinkTimes={led.blinkTimes}
        blinkSpeed={led.blinkSpeed}
        colorName={led.colorName}
        onTimesChange={led.setBlinkTimes}
        onSpeedChange={led.setBlinkSpeed}
        onBlink={led.blink}
      />
    </LedSectionLayout>
  )
}
