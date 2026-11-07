import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onTurnOn: () => void
  readonly onTurnOff: () => void
}

export const PowerButtons: FC<Props> = ({ onTurnOn, onTurnOff }) => {
  const { t } = useTranslation()

  return (
    <>
      <button
        className="btn btn-success btn-sm fw-bold px-3 flex-grow-1"
        type="button"
        onClick={onTurnOn}
      >
        <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="me-1">
          <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32v224c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.5-184.6-13.6-11.3-33.8-9.5-45.1 4.1s-9.5 33.8 4.1 45.1c42.5 35.4 69.5 88.6 69.5 148.4 0 106-86 192-192 192S64 362 64 256c0-59.8 27-113 69.5-148.4z" />
        </svg>
        {t('led.btnOn')}
      </button>
      <button
        className="btn btn-secondary btn-sm fw-bold px-3 flex-grow-1"
        type="button"
        onClick={onTurnOff}
      >
        <svg width="14" height="14" viewBox="0 0 640 512" fill="currentColor" className="me-1">
          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L507.4 366.1C553.8 321.3 576 254.6 576 192c0-106-86-192-192-192-56.5 0-107.2 24.5-142.3 63.6L38.8 5.1zM320 448c26.5 0 48-21.5 48-48H272c0 26.5 21.5 48 48 48z" />
        </svg>
        {t('led.btnOff')}
      </button>
    </>
  )
}
