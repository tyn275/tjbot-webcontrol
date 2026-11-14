import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { MuscleState } from '../arm.commands'

interface Props {
  readonly muscle: MuscleState
  readonly onToggle: (state: MuscleState) => void
}

// Cụm nút chuyển đổi trạng thái cơ bắp cánh tay (Cơ bắp / Nghỉ ngơi)
export const MuscleToggle: FC<Props> = ({ muscle, onToggle }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex align-items-center gap-2 ms-auto">
      <span className="small fw-bold text-secondary">
        <i className="fa-solid fa-dumbbell me-1" />
        {t('arm.muscleState')}
      </span>
      <div className="btn-group border rounded p-1 arm-card__muscle-group" role="group">
        <button
          type="button"
          className={`btn btn-sm fw-bold px-3 border-0 rounded ${
            muscle === 'on' ? 'btn-success text-white' : 'btn-outline-success'
          }`}
          onClick={() => onToggle('on')}
        >
          {t('arm.muscleOn')}
        </button>
        <button
          type="button"
          className={`btn btn-sm fw-bold px-3 border-0 rounded ${
            muscle === 'off' ? 'btn-danger text-white' : 'btn-outline-danger'
          }`}
          onClick={() => onToggle('off')}
        >
          {t('arm.muscleOff')}
        </button>
      </div>
    </div>
  )
}
