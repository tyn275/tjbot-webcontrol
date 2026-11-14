import type { FC } from 'react'

export interface GymPlaceholderCardProps {
  title: string
  notice: string
}

// Thẻ giữ chỗ cho các khối phần cứng trong phòng tập
export const GymPlaceholderCard: FC<GymPlaceholderCardProps> = ({ title, notice }) => {
  return (
    <div className="card feature-card shadow-sm h-100 border-0 p-4">
      <h5 className="card-title fw-bold text-dark mb-3">{title}</h5>
      <div className="alert alert-light border text-muted small mb-0">{notice}</div>
    </div>
  )
}
