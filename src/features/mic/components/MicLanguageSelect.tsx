import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MIC_LANGUAGES, type MicLanguage } from '../mic.types'

interface Props {
  readonly lang: MicLanguage
  readonly onLangChange: (lang: MicLanguage) => void
}

// Danh sách thả xuống chọn ngôn ngữ nhận diện giọng nói
export const MicLanguageSelect: FC<Props> = ({ lang, onLangChange }) => {
  const { t } = useTranslation()

  return (
    <select
      className="form-select form-select-sm"
      value={lang}
      onChange={(e) => onLangChange(e.target.value as MicLanguage)}
    >
      {MIC_LANGUAGES.map((item) => (
        <option key={item.value} value={item.value}>
          {t(item.labelKey)}
        </option>
      ))}
    </select>
  )
}
