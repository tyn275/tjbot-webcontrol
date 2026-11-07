import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly labelKey?: string
}

export const LedBulbSim: FC<Props> = ({ labelKey = 'led.led1Label' }) => {
  const { t } = useTranslation()

  return (
    <div className="led__bulb-sim p-3 bg-white rounded d-flex flex-column align-items-center justify-content-center border">
      <svg
        className="led__bulb-svg"
        width="64"
        height="64"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M 50 12 C 33 12 22 24 22 39 C 22 49 27 55 33 61 C 36 64 36 67 36 69 L 64 69 C 64 67 64 64 67 61 C 73 55 78 49 78 39 C 78 24 67 12 50 12 Z" />
        <path
          d="M 33 42 C 28 35 28 26 36 19"
          fill="none"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M 38 74 L 62 74 C 62 82 56 86 50 86 C 44 86 38 82 38 74 Z" />
      </svg>
      <div className="led__bulb-tag mt-2 text-muted fw-bold">{t(labelKey)}</div>
    </div>
  )
}
