import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly followMe: boolean
  readonly onToggleFollowMe: (next: boolean) => void
  readonly onExecute: () => void
}

// Khối điều khiển kích hoạt chế độ bám theo thời gian thực và nút thực hiện góc quay
export const AngleControlSection: FC<Props> = ({ followMe, onToggleFollowMe, onExecute }) => {
  const { t } = useTranslation()

  return (
    <div className="flex-grow-1">
      <div className="mb-2">
        <label className="form-label fw-semibold text-secondary small mb-1">
          {t('arm.angleSectionTitle')}
        </label>
      </div>
      <div className="d-flex flex-column gap-3 bg-light p-3 rounded border">
        <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
          <input
            className="form-check-input ms-0 arm-switch"
            type="checkbox"
            id="chkFollowMe"
            checked={followMe}
            onChange={(e) => onToggleFollowMe(e.target.checked)}
          />
          <label className="form-check-label small fw-bold text-dark" htmlFor="chkFollowMe">
            <i className="fa-solid fa-bolt text-warning me-1" />
            {t('arm.followMe')}
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary fw-bold w-100 btn-sm"
          disabled={followMe}
          onClick={onExecute}
        >
          <i className="fa-solid fa-circle-check me-1" />
          {t('arm.execute')}
        </button>
      </div>
      <div className="text-muted small mt-2 arm-card__guide">{t('arm.angleGuide')}</div>
    </div>
  )
}
