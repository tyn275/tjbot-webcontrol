import type { FC, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { WaveSpeed } from '../arm.commands'

interface Props {
  readonly times: number
  readonly speed: WaveSpeed
  readonly onTimesChange: (next: number) => void
  readonly onSpeedChange: (next: WaveSpeed) => void
}

// Cụm nhập thông số số lần và lựa chọn tốc độ vẫy tay
export const WaveInputs: FC<Props> = ({ times, speed, onTimesChange, onSpeedChange }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="arm-wave__times">
        <span className="text-muted small fw-bold d-block mb-1">{t('arm.times')}</span>
        <input
          type="number"
          className="form-control form-control-sm text-center"
          value={times}
          min={1}
          max={20}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onTimesChange(Number(e.target.value))}
        />
      </div>
      <div className="arm-wave__speed">
        <span className="text-muted small fw-bold d-block mb-1">{t('arm.speed')}</span>
        <select
          className="form-select form-select-sm"
          value={speed}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onSpeedChange(e.target.value as WaveSpeed)
          }
        >
          <option value="fast">{t('arm.speedFast')}</option>
          <option value="low">{t('arm.speedSlow')}</option>
        </select>
      </div>
    </>
  )
}
