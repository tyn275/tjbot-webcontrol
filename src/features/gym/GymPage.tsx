import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GymPlaceholderCard } from './components/GymPlaceholderCard'
import { LedHexCard } from '../led/LedHexCard'
import { ArmPanel } from '../arm/ArmPanel'

interface Props {
  readonly botId?: string
  readonly isConnected?: boolean
}

export const GymPage: FC<Props> = ({ botId = 'tjbot1', isConnected = false }) => {
  const { t } = useTranslation()
  const notice = t('placeholderNotice')

  return (
    <div className="gym-layout container-fluid p-1">
      <div className="row g-4">
        <div className="col-md-6">
          <LedHexCard botId={botId} isConnected={isConnected} />
        </div>
        <div className="col-md-6">
          <ArmPanel botId={botId} isConnected={isConnected} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardAudio')} notice={notice} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardMic')} notice={notice} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardCamera')} notice={notice} />
        </div>
      </div>
    </div>
  )
}
