import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onSpeak: () => void
  readonly onSilent: () => void
}

// Cụm nút bấm phát giọng đọc TTS và ngắt âm khẩn cấp
export const TtsButtons: FC<Props> = ({ onSpeak, onSilent }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex gap-2 mt-1">
      <button
        type="button"
        className="btn btn-primary btn-sm fw-bold flex-grow-1"
        onClick={onSpeak}
      >
        <i className="fa-solid fa-volume-high me-1" /> {t('audio.btnSpeakTts')}
      </button>
      <button type="button" className="btn btn-secondary btn-sm fw-bold px-3" onClick={onSilent}>
        <i className="fa-solid fa-comment-slash me-1" /> {t('audio.btnSilent')}
      </button>
    </div>
  )
}
