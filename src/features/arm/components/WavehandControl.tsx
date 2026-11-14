import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { WaveInputs } from './WaveInputs'
import { WaveButtons } from './WaveButtons'
import type { WaveSpeed } from '../arm.commands'

interface Props {
  readonly times: number
  readonly speed: WaveSpeed
  readonly commandLog: string
  readonly onTimesChange: (next: number) => void
  readonly onSpeedChange: (next: WaveSpeed) => void
  readonly onWave: () => void
  readonly onStop: () => void
}

// Bảng điều khiển kịch bản vẫy tay robot
export const WavehandControl: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { times, speed, commandLog, onTimesChange, onSpeedChange, onWave, onStop } = props

  return (
    <div className="flex-grow-1">
      <div className="mb-2">
        <label className="form-label fw-semibold text-secondary small mb-1">
          {t('arm.waveSectionTitle')}
        </label>
      </div>
      <div className="bg-light p-2 rounded border">
        <div className="d-flex align-items-end gap-2">
          <WaveInputs
            times={times}
            speed={speed}
            onTimesChange={onTimesChange}
            onSpeedChange={onSpeedChange}
          />
          <WaveButtons onWave={onWave} onStop={onStop} />
        </div>
      </div>
      <div className="text-muted mt-2 arm-card__log">
        <span>{t('arm.commandLog')} </span>
        <span className="text-primary fw-bold">{commandLog}</span>
      </div>
    </div>
  )
}
