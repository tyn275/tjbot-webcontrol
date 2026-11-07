import { useState, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from './layout/Navbar'
import { Sidebar, type TabId } from './layout/Sidebar'
import { LogMonitor } from './layout/LogMonitor'
import { IntroPage } from '../features/intro/IntroPage'
import { GymPage } from '../features/gym/GymPage'

// Định dạng nhật ký hành động giao diện người dùng
const createUiLog = (text: string): string => `[${new Date().toLocaleTimeString()}] [UI] ${text}`

// Hook quản lý trạng thái thanh điều hướng, tab và kết nối giao diện
const useDashboard = () => {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('gym')
  const [hasVisitedIntro, setHasVisitedIntro] = useState(false)
  const [botId, setBotId] = useState('tjbot1')
  const [isConnected, setIsConnected] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    const key = !isCollapsed ? 'logSidebarCollapsed' : 'logSidebarExpanded'
    setLogs((prev) => [...prev, createUiLog(t(key))])
  }

  const selectTab = (tab: TabId) => {
    setActiveTab(tab)
    if (tab === 'intro') setHasVisitedIntro(true)
    setLogs((prev) => [...prev, createUiLog(t('logNavigated', { route: tab.toUpperCase() }))])
  }

  const toggleConnect = () => {
    setIsConnected(!isConnected)
    const action = !isConnected ? t('connected') : t('disconnected')
    setLogs((prev) => [...prev, createUiLog(`[MQTT] ${action}: ${botId}`)])
  }

  return {
    isCollapsed,
    activeTab,
    hasVisitedIntro,
    botId,
    isConnected,
    logs,
    setBotId,
    toggleSidebar,
    selectTab,
    toggleConnect,
  }
}

export const App: FC = () => {
  const {
    isCollapsed,
    activeTab,
    hasVisitedIntro,
    botId,
    isConnected,
    logs,
    setBotId,
    toggleSidebar,
    selectTab,
    toggleConnect,
  } = useDashboard()

  return (
    <div className="app-root">
      <Navbar
        onToggleSidebar={toggleSidebar}
        botId={botId}
        isConnected={isConnected}
        onBotIdChange={setBotId}
        onToggleConnect={toggleConnect}
      />
      <div className="app-root__body">
        <Sidebar isCollapsed={isCollapsed} activeTab={activeTab} onSelectTab={selectTab} />
        <main className="app-root__main">
          <div className="app-root__viewport">
            {/* Chỉ riêng iframe Giới thiệu là tải 1 lần và ẩn/hiện bằng CSS */}
            {hasVisitedIntro && (
              <div className={`h-100 ${activeTab !== 'intro' ? 'd-none' : ''}`}>
                <IntroPage />
              </div>
            )}
            {activeTab === 'gym' && <GymPage />}
          </div>
          <LogMonitor logs={logs} />
        </main>
      </div>
    </div>
  )
}
