import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

// Khối tiêu đề chính của card phân hệ Microphone
export const MicHeader: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
      <div className="d-flex align-items-center">
        <div className="mic__header-icon rounded me-3">
          <i className="fa-solid fa-microphone fa-2x" />
        </div>
        <div>
          <h5 className="fw-bold text-dark mb-0">{t('mic.title')}</h5>
          <small className="text-muted">{t('mic.subtitle')}</small>
        </div>
      </div>
    </div>
  )
}
