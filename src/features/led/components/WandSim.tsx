import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly active: boolean
  readonly labelKey?: string
}

export const WandSim: FC<Props> = ({ active, labelKey = 'led.led3Label' }) => {
  const { t } = useTranslation()
  const activeClass = active ? 'led__wand-svg--active' : ''

  return (
    <div className="led__bulb-sim p-3 bg-white rounded d-flex flex-column align-items-center justify-content-center border">
      <svg
        className={`led__wand-svg ${activeClass}`}
        width="64"
        height="64"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <rect x="14" y="42" width="76" height="18" rx="9" transform="rotate(-45 52 51)" />
        <rect
          x="66"
          y="42"
          width="24"
          height="18"
          rx="4"
          fill="rgba(255, 255, 255, 0.6)"
          transform="rotate(-45 52 51)"
        />
        <path d="M 25 8 Q 25 22 11 22 Q 25 22 25 36 Q 25 22 39 22 Q 25 22 25 8 Z" />
        <path d="M 54 3 Q 54 12 45 12 Q 54 12 54 21 Q 54 12 63 12 Q 54 12 54 3 Z" />
        <path d="M 82 50 Q 82 62 70 62 Q 82 62 82 74 Q 82 62 94 62 Q 82 62 82 50 Z" />
      </svg>
      <div className="led__bulb-tag mt-2 text-muted fw-bold">{t(labelKey)}</div>
    </div>
  )
}
