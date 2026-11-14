import type { FC } from 'react'
import { useLedRgb } from '../hooks/useLedRgb'
import { RgbInputGroup } from './RgbInputGroup'
import { PowerButtons } from './PowerButtons'
import { BlinkControl } from './BlinkControl'
import { LedSectionLayout } from './LedSectionLayout'

interface Props {
  readonly botId: string
  readonly isConnected: boolean
}

export const LedRgbSection: FC<Props> = ({ botId, isConnected }) => {
  const led = useLedRgb(botId, isConnected)

  return (
    <LedSectionLayout
      hexColor={led.hexColor}
      labelKey="led.led2Label"
      titleKey="led.rgbSection"
      className="mt-3 pt-3 border-top"
    >
      <RgbInputGroup values={led.rgb} onChange={led.handleRgbChange} />
      <div className="d-flex gap-2 my-2">
        <PowerButtons onTurnOn={led.turnOn} onTurnOff={led.turnOff} />
      </div>
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
