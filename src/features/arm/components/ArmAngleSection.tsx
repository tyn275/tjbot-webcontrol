import type { FC } from 'react'
import { AngleDial } from './AngleDial'
import { AngleControlSection } from './AngleControlSection'

interface Props {
  readonly angle: number
  readonly followMe: boolean
  readonly onChange: (next: number) => void
  readonly onCommit: () => void
  readonly onToggleFollowMe: (next: boolean) => void
  readonly onExecute: () => void
}

// Hàng điều khiển góc quay servo cánh tay robot
export const ArmAngleSection: FC<Props> = (props) => (
  <div className="row align-items-center mb-3">
    <div className="col-auto">
      <AngleDial angle={props.angle} onChange={props.onChange} onCommit={props.onCommit} />
    </div>
    <div className="col">
      <AngleControlSection
        followMe={props.followMe}
        onToggleFollowMe={props.onToggleFollowMe}
        onExecute={props.onExecute}
      />
    </div>
  </div>
)
