import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

// Khối tiêu đề chính của card phân hệ âm thanh
export const AudioHeader: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
      <div className="d-flex align-items-center">
        <div className="audio__header-icon rounded me-3">
          <i className="fa-solid fa-volume-high fa-2x" />
        </div>
        <div>
          <h5 className="fw-bold text-dark mb-0">{t('audio.title')}</h5>
          <small className="text-muted">{t('audio.subtitle')}</small>
        </div>
      </div>
    </div>
  )
}
