import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly titleKey: string
}

// Thẻ hiển thị thông báo giữ chỗ cho tính năng đang trong lộ trình phát triển
export const GymPlaceholderCard: FC<Props> = ({ titleKey }) => {
  const { t } = useTranslation()

  return (
    <div className="card h-100 border-0 shadow-sm gym-placeholder">
      <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
        <h5 className="card-title fw-bold text-muted mb-2">{t(titleKey)}</h5>
        <p className="text-secondary small mb-0">{t('placeholderNotice')}</p>
      </div>
    </div>
  )
}
