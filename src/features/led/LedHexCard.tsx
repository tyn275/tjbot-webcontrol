import type { FC } from 'react'
import { LedCardHeader } from './components/LedCardHeader'
import { LedHexSection } from './components/LedHexSection'
import { LedRgbSection } from './components/LedRgbSection'
import { LedRainbowSection } from './components/LedRainbowSection'

interface Props {
  readonly botId?: string
  readonly isConnected?: boolean
}

export const LedHexCard: FC<Props> = ({ botId = 'tjbot1', isConnected = false }) => {
  return (
    <div className="led card p-4 shadow-sm border-0 h-100">
      <LedCardHeader />
      <LedHexSection botId={botId} isConnected={isConnected} />
      <LedRgbSection botId={botId} isConnected={isConnected} />
      <LedRainbowSection botId={botId} isConnected={isConnected} />
    </div>
  )
}
