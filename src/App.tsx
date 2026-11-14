import { useState, type FC } from 'react'
import { Navbar } from './layout/navbar/Navbar'
import { Sidebar, type TabId } from './layout/sidebar/Sidebar'
import { LogMonitor } from './layout/log-monitor/LogMonitor'
import { IntroPage } from './features/intro/IntroPage'
import { GymPage } from './features/gym/GymPage'
import { useMqttConnection } from './hooks/useMqttConnection'
import { useLogStream } from './hooks/useLogStream'
import { logNavigated, logSidebarToggle } from './services/logger/log.service'

const useNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('gym')
  const [hasVisitedIntro, setHasVisitedIntro] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      logSidebarToggle(next)
      return next
    })
  }

  const selectTab = (tab: TabId) => {
    setActiveTab(tab)
    if (tab === 'intro') setHasVisitedIntro(true)
    logNavigated(tab.toUpperCase())
  }

  return { isCollapsed, activeTab, hasVisitedIntro, toggleSidebar, selectTab }
}

export const App: FC = () => {
  const [botId, setBotId] = useState('tjbot1')
  const nav = useNavigation()
  const logStream = useLogStream()
  const { isConnected, isConnecting, toggleConnect } = useMqttConnection(botId)

  return (
    <div className="app-root">
      <Navbar
        onToggleSidebar={nav.toggleSidebar}
        botId={botId}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onBotIdChange={setBotId}
        onToggleConnect={toggleConnect}
      />
      <div className="app-root__body">
        <Sidebar
          isCollapsed={nav.isCollapsed}
          activeTab={nav.activeTab}
          onSelectTab={nav.selectTab}
        />
        <main className="app-root__main">
          <div className="app-root__viewport">
            {nav.hasVisitedIntro && (
              <div className={`h-100 ${nav.activeTab !== 'intro' ? 'd-none' : ''}`}>
                <IntroPage />
              </div>
            )}
            {nav.activeTab === 'gym' && <GymPage botId={botId} isConnected={isConnected} />}
          </div>
          <LogMonitor logs={logStream.logs} />
        </main>
      </div>
    </div>
  )
}
