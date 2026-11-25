import type { FC } from 'react'
import { LedHexCard } from '../../features/led/LedHexCard'
import { ArmPanel } from '../../features/arm/ArmPanel'
import { AudioPanel } from '../../features/audio/AudioPanel'
import { MicPanel } from '../../features/mic/MicPanel'

interface Props {
  readonly botId: string
  readonly isConnected: boolean
}

// Trang hiển thị toàn bộ các bảng điều khiển phân hệ của TJBot
export const GymPage: FC<Props> = ({ botId, isConnected }) => {
  return (
    <div className="container-fluid p-2 p-sm-3 gym-layout">
      <div className="row g-2 g-sm-3">
        <div className="col-12 col-md-6">
          <LedHexCard botId={botId} isConnected={isConnected} />
        </div>
        <div className="col-12 col-md-6">
          <ArmPanel botId={botId} isConnected={isConnected} />
        </div>
        <div className="col-12 col-md-6">
          <AudioPanel botId={botId} isConnected={isConnected} />
        </div>
        <div className="col-12 col-md-6">
          <MicPanel botId={botId} isConnected={isConnected} />
        </div>
      </div>
    </div>
  )
}
