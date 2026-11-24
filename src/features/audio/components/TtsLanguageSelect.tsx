import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, type TtsLanguage } from '../audio.types'

interface Props {
  readonly lang: TtsLanguage
  readonly onLangChange: (lang: TtsLanguage) => void
}

// Ô chọn ngôn ngữ quốc gia cho tác vụ chuyển đổi văn bản TTS
export const TtsCountrySelect: FC<Props> = ({ lang, onLangChange }) => {
  const { t } = useTranslation()

  return (
    <div>
      <label className="text-muted small fw-bold d-block mb-1">{t('audio.labelLanguage')}</label>
      <select
        className="form-select form-select-sm"
        value={lang}
        onChange={(e) => onLangChange(e.target.value as TtsLanguage)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.value} value={l.value}>
            {t(l.labelKey)}
          </option>
        ))}
      </select>
    </div>
  )
}
