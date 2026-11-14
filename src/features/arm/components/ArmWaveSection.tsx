import type { FC } from 'react'
import { WaveSim } from './WaveSim'
import { WavehandControl } from './WavehandControl'
import type { WaveSpeed } from '../arm.commands'

interface Props {
  readonly times: number
  readonly speed: WaveSpeed
  readonly commandLog: string
  readonly onTimesChange: (next: number) => void
  readonly onSpeedChange: (next: WaveSpeed) => void
  readonly onWave: () => void
  readonly onStop: () => void
}

// Hàng điều khiển kịch bản vẫy tay robot với dải phân cách liền nét
export const ArmWaveSection: FC<Props> = (props) => (
  <div className="row align-items-center mt-3 pt-3 border-top">
    <div className="col-auto">
      <WaveSim />
    </div>
    <div className="col">
      <WavehandControl {...props} />
    </div>
  </div>
)
