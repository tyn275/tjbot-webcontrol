import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { VOICE_DATA, type TtsLanguage } from '../audio.types'

interface Props {
  readonly lang: TtsLanguage
  readonly voice: string
  readonly onVoiceChange: (voice: string) => void
}

// Ô chọn giọng đọc tương ứng theo từng ngôn ngữ quốc gia
export const TtsVoiceSelect: FC<Props> = ({ lang, voice, onVoiceChange }) => {
  const { t } = useTranslation()
  const voices = VOICE_DATA[lang] ?? []

  return (
    <div>
      <label className="text-muted small fw-bold d-block mb-1 audio__sub-label">
        {t('audio.labelVoice')}
      </label>
      <select
        className="form-select form-select-sm"
        value={voice}
        onChange={(e) => onVoiceChange(e.target.value)}
      >
        {voices.map((v) => (
          <option key={v.value} value={v.value}>
            {v.text}
          </option>
        ))}
      </select>
    </div>
  )
}
