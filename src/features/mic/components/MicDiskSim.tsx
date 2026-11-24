import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly variant: 'record' | 'listen'
  readonly active: boolean
  readonly labelKey: string
}

// Khung đĩa tròn mô phỏng trạng thái thu âm và lắng nghe nhận diện
export const MicDiskSim: FC<Props> = ({ variant, active, labelKey }) => {
  const { t } = useTranslation()
  const isRecord = variant === 'record'
  const iconClass = isRecord
    ? `fa-solid fa-microphone-lines mic__icon-record ${active ? 'mic__pulse-orange' : ''}`
    : `fa-solid fa-brain mic__icon-listen ${active ? 'mic__pulse-blue' : ''}`

  return (
    <div className="text-center border-end pe-3 mic__disk-container">
      <div
        className={`p-2 bg-white rounded d-flex flex-column align-items-center justify-content-center border mic__disk-container--${variant}`}
      >
        <div className="mic__disk">
          <i className={iconClass} />
        </div>
        <div className={`mic__disk-label mic__disk-label--${variant}`}>{t(labelKey)}</div>
      </div>
    </div>
  )
}
