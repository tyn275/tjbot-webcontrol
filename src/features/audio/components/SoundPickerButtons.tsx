import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onPlay: () => void
  readonly onSilent: () => void
}

// Cụm nút bấm phát âm thanh và ngắt âm khẩn cấp cho khối phát file có sẵn
export const SoundPickerButtons: FC<Props> = ({ onPlay, onSilent }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn fw-bold flex-grow-1 btn-sm audio__btn-play"
        onClick={onPlay}
      >
        <i className="fa-solid fa-play me-1" /> {t('audio.btnSpeak')}
      </button>
      <button type="button" className="btn btn-secondary btn-sm fw-bold px-3" onClick={onSilent}>
        <i className="fa-solid fa-comment-slash me-1" /> {t('audio.btnSilent')}
      </button>
    </div>
  )
}
