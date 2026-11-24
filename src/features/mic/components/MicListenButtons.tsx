import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onStart: () => void
  readonly onStop: () => void
}

// Cặp nút điều khiển tiến trình lắng nghe nhận diện giọng nói AI
export const MicListenButtons: FC<Props> = ({ onStart, onStop }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex gap-2 mt-1">
      <button
        type="button"
        className="btn btn-sm fw-bold flex-grow-1 mic__btn-listen"
        onClick={onStart}
      >
        <i className="fa-solid fa-bolt me-1" />
        {t('mic.btnListen')}
      </button>
      <div className="mic__side-box">
        <button type="button" className="btn btn-secondary btn-sm fw-bold w-100" onClick={onStop}>
          <i className="fa-solid fa-stop me-1" />
          {t('mic.btnStop')}
        </button>
      </div>
    </div>
  )
}
