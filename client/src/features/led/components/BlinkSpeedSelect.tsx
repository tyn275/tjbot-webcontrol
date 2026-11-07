import type { FC, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly speed: 'fast' | 'slow'
  readonly onChange: (speed: 'fast' | 'slow') => void
}

export const BlinkSpeedSelect: FC<Props> = ({ speed, onChange }) => {
  const { t } = useTranslation()
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) =>
    onChange(e.target.value as 'fast' | 'slow')

  return (
    <div className="d-flex align-items-center gap-1 flex-grow-1">
      <span className="small text-muted fw-bold text-nowrap">{t('led.blinkSpeed')}</span>
      <select className="form-select form-select-sm" value={speed} onChange={handleSelect}>
        <option value="fast">{t('led.speedFast')}</option>
        <option value="slow">{t('led.speedSlow')}</option>
      </select>
    </div>
  )
}
