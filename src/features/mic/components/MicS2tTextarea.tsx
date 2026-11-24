import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly value: string
}

// Khung hiển thị kết quả văn bản Speech-to-Text nhận dạng được
export const MicS2tTextarea: FC<Props> = ({ value }) => {
  const { t } = useTranslation()

  return (
    <div>
      <textarea
        className="form-control form-control-sm bg-white fw-semibold text-dark mic__s2t-textarea"
        rows={2}
        readOnly
        value={value}
        placeholder={t('mic.s2tPlaceholder')}
      />
      <div className="mt-1 px-1">
        <span className="text-danger small mic__guide fw-semibold">{t('mic.recordNotice')}</span>
      </div>
    </div>
  )
}
