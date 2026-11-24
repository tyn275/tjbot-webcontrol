import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onStart: () => void
  readonly onStop: () => void
}

// Cặp nút điều khiển tiến trình thu âm nói nhại
export const MicRecordButtons: FC<Props> = ({ onStart, onStop }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="mic__btn-box-record">
        <button
          type="button"
          className="btn btn-sm fw-bold w-100 mic__btn-record"
          onClick={onStart}
        >
          <i className="fa-solid fa-ear-listen me-1" />
          {t('mic.btnRecord')}
        </button>
      </div>
      <div className="flex-grow-0">
        <button type="button" className="btn btn-secondary btn-sm fw-bold px-3" onClick={onStop}>
          <i className="fa-solid fa-stop me-1" />
          {t('mic.btnStop')}
        </button>
      </div>
    </>
  )
}
