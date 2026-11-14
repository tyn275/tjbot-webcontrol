import type { FC } from 'react'
import { ArmHeader } from './components/ArmHeader'
import { ArmAngleSection } from './components/ArmAngleSection'
import { ArmWaveSection } from './components/ArmWaveSection'
import { useArmMuscle } from './hooks/useArmMuscle'
import { useArmAngle } from './hooks/useArmAngle'
import { useArmWave } from './hooks/useArmWave'

interface Props {
  readonly botId?: string
  readonly isConnected?: boolean
}

// Bảng điều khiển phân hệ cánh tay robot với góc quay và kịch bản vẫy tay
export const ArmPanel: FC<Props> = ({ botId = 'tjbot1', isConnected = false }) => {
  const { muscle, sendMuscle, ensureMuscleOn } = useArmMuscle({ botId, isConnected })
  const angleCtrl = useArmAngle({ botId, isConnected, onEnsureMuscle: ensureMuscleOn })
  const waveCtrl = useArmWave({ botId, isConnected, onEnsureMuscle: ensureMuscleOn })

  return (
    <div className="card p-4 shadow-sm border-0 arm-card h-100">
      <ArmHeader muscle={muscle} onToggle={sendMuscle} />
      <ArmAngleSection
        angle={angleCtrl.angle}
        followMe={angleCtrl.followMe}
        onChange={angleCtrl.updateAngle}
        onCommit={angleCtrl.commitAngle}
        onToggleFollowMe={angleCtrl.setFollowMe}
        onExecute={() => angleCtrl.dispatchAngle(angleCtrl.angle)}
      />
      <ArmWaveSection
        times={waveCtrl.times}
        speed={waveCtrl.speed}
        commandLog={waveCtrl.commandLog}
        onTimesChange={waveCtrl.setTimes}
        onSpeedChange={waveCtrl.setSpeed}
        onWave={waveCtrl.wave}
        onStop={waveCtrl.stop}
      />
    </div>
  )
}
