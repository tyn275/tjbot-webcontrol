import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly variant: 'bibo' | 'reading'
  readonly active: boolean
  readonly labelKey: string
}

// Khung đĩa tròn mô phỏng trạng thái nói và đọc của robot
export const AudioDiskSim: FC<Props> = ({ variant, active, labelKey }) => {
  const { t } = useTranslation()
  const isBibo = variant === 'bibo'
  const iconClass = isBibo
    ? `fa-solid fa-face-kiss-beam audio__icon-lips ${active ? 'audio__talking-animation' : ''}`
    : `fa-solid fa-book-open-reader audio__icon-book ${active ? 'audio__reading-animation' : ''}`

  return (
    <div className="text-center border-end pe-3 audio__disk-container">
      <div
        className={`p-2 bg-white rounded d-flex flex-column align-items-center justify-content-center border audio__disk-container--${variant}`}
      >
        <div className="audio__disk">
          <i className={iconClass} />
        </div>
        <div className={`audio__disk-label audio__disk-label--${variant}`}>{t(labelKey)}</div>
      </div>
    </div>
  )
}
