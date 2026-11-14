import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLedRainbow } from '../hooks/useLedRainbow'
import { WandSim } from './WandSim'
import { RainbowButtons } from './RainbowButtons'
import { RainbowStopButton } from './RainbowStopButton'

interface Props {
  readonly botId: string
  readonly isConnected: boolean
}

export const LedRainbowSection: FC<Props> = ({ botId, isConnected }) => {
  const { t } = useTranslation()
  const rainbow = useLedRainbow(botId, isConnected)

  return (
    <div className="row align-items-center mt-3 pt-3 border-top">
      <div className="col-auto text-center border-end pe-4 me-2">
        <WandSim active={rainbow.activeEffect !== null} labelKey="led.led3Label" />
      </div>
      <div className="col">
        <label className="form-label small mb-2 led__rainbow-title">
          {t('led.rainbowSection')}
        </label>
        <RainbowButtons onTrigger={rainbow.triggerEffect} />
        <RainbowStopButton onTurnOff={rainbow.turnOff} />
      </div>
    </div>
  )
}
