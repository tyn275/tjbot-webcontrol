import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onTurnOff: () => void
}

export const RainbowStopButton: FC<Props> = ({ onTurnOff }) => {
  const { t } = useTranslation()

  return (
    <div className="mt-2">
      <button className="btn btn-secondary btn-sm fw-bold w-100" type="button" onClick={onTurnOff}>
        <svg width="14" height="14" viewBox="0 0 640 512" fill="currentColor" className="me-1">
          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L507.4 366.1C553.8 321.3 576 254.6 576 192c0-106-86-192-192-192-56.5 0-107.2 24.5-142.3 63.6L38.8 5.1zM320 448c26.5 0 48-21.5 48-48H272c0 26.5 21.5 48 48 48z" />
        </svg>
        {t('led.btnOff')}
      </button>
    </div>
  )
}
