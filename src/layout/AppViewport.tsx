import type { FC } from 'react'
import type { TabId } from './sidebar/Sidebar'
import { IntroPage } from '../features/intro/IntroPage'
import { GymPage } from '../pages/gym/GymPage'
import { GymPlaceholderCard } from '../pages/gym/GymPlaceholderCard'

interface Props {
  readonly activeTab: TabId
  readonly hasVisitedIntro: boolean
  readonly botId: string
  readonly isConnected: boolean
}

// Khung điều hướng hiển thị nội dung giao diện theo tab đang chọn
export const AppViewport: FC<Props> = ({ activeTab, hasVisitedIntro, botId, isConnected }) => (
  <div className="app-root__viewport">
    {hasVisitedIntro && (
      <div className={`h-100 ${activeTab !== 'intro' ? 'd-none' : ''}`}>
        <IntroPage />
      </div>
    )}
    <div className={`h-100 ${activeTab !== 'gym' ? 'd-none' : ''}`}>
      <GymPage botId={botId} isConnected={isConnected} />
    </div>
    {activeTab === 'actions' && <GymPlaceholderCard titleKey="navActions" />}
    {activeTab === 'wifi' && <GymPlaceholderCard titleKey="navWifi" />}
  </div>
)
