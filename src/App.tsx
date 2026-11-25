import { useEffect, useState, type FC } from 'react'
import { Navbar } from './layout/navbar/Navbar'
import { Sidebar, type TabId } from './layout/sidebar/Sidebar'
import { LogMonitor } from './layout/log-monitor/LogMonitor'
import { AppViewport } from './layout/AppViewport'
import { useMqttConnection } from './hooks/useMqttConnection'
import { useLogStream } from './hooks/useLogStream'
import { logNavigated, logSidebarToggle } from './services/logger/log.service'
import {
  getRecentBotIds,
  saveRecentBotId,
  getSavedBotId,
  saveBotId,
} from './services/storage/storage'
import { env } from './core/env'

const useRecentBotHistory = (botId: string, isConnected: boolean): string[] => {
  const [recentBotIds, setRecentBotIds] = useState(getRecentBotIds)

  useEffect(() => {
    if (!isConnected) return
    saveBotId(botId)
    saveRecentBotId(botId)
    setRecentBotIds(getRecentBotIds())
  }, [botId, isConnected])

  return recentBotIds
}

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
  const [botId, setBotId] = useState(() => getSavedBotId(env.defaultBotId))
  const nav = useNavigation()
  const logStream = useLogStream()
  const { isConnected, isConnecting, toggleConnect } = useMqttConnection(botId)
  const recentBotIds = useRecentBotHistory(botId, isConnected)

  return (
    <div className="app-root">
      <Navbar
        onToggleSidebar={nav.toggleSidebar}
        botId={botId}
        recentBotIds={recentBotIds}
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
          <AppViewport
            activeTab={nav.activeTab}
            hasVisitedIntro={nav.hasVisitedIntro}
            botId={botId}
            isConnected={isConnected}
          />
          <LogMonitor logs={logStream.logs} />
        </main>
      </div>
    </div>
  )
}
