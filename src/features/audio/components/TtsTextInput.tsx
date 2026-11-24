import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HARDWARE_LIMITS } from '../../../core/hardware-limits'

export interface TtsTextInputProps {
  readonly text: string
  readonly wordCount: number
  readonly isOverLimit: boolean
  readonly onTextChange: (val: string) => void
}

// Khung nhập liệu văn bản kèm nhãn đếm số từ và cảnh báo vượt ngưỡng an toàn
export const TtsTextInput: FC<TtsTextInputProps> = ({
  text,
  wordCount,
  isOverLimit,
  onTextChange,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <textarea
        className="form-control form-control-sm"
        rows={2}
        placeholder={t('audio.placeholderTts')}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
      <div className="d-flex justify-content-between mt-1 px-1">
        <span className="text-danger fw-bold audio__alert">
          {isOverLimit ? t('audio.alertLimit') : ''}
        </span>
        <span className="text-muted audio__word-count">
          {wordCount} / {HARDWARE_LIMITS.TTS_MAX_WORDS} {t('audio.wordCountSuffix')}
        </span>
      </div>
    </div>
  )
}
