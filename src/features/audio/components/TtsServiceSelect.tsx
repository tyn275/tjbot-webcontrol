import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SERVICES, type TtsService } from '../audio.types'

interface Props {
  readonly service: TtsService
  readonly onServiceChange: (service: TtsService) => void
}

// Ô chọn dịch vụ AI tổng hợp giọng nói
export const TtsServiceSelect: FC<Props> = ({ service, onServiceChange }) => {
  const { t } = useTranslation()

  return (
    <div>
      <label className="text-muted small fw-bold d-block mb-1 audio__sub-label">
        {t('audio.labelService')}
      </label>
      <select
        className="form-select form-select-sm"
        value={service}
        onChange={(e) => onServiceChange(e.target.value as TtsService)}
      >
        {SERVICES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
