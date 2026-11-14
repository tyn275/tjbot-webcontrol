import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MuscleToggle } from './MuscleToggle'
import { RobotArmIcon } from './RobotArmIcon'
import type { MuscleState } from '../arm.commands'

interface Props {
  readonly muscle: MuscleState
  readonly onToggle: (state: MuscleState) => void
}

// Thanh tiêu đề phân hệ cánh tay robot với logo cánh tay và công tắc cơ bắp
export const ArmHeader: FC<Props> = ({ muscle, onToggle }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
      <div className="d-flex align-items-center">
        <div className="p-2 rounded me-3 d-flex align-items-center justify-content-center arm-card__icon-box">
          <RobotArmIcon />
        </div>
        <div>
          <h5 className="fw-bold text-dark mb-0">{t('arm.cardTitle')}</h5>
          <small className="text-muted">{t('arm.cardSubtitle')}</small>
        </div>
      </div>
      <MuscleToggle muscle={muscle} onToggle={onToggle} />
    </div>
  )
}
