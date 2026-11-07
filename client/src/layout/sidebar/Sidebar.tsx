import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { InfoIcon, DumbbellIcon, BoltIcon, GearIcon } from '../Icons'

export type TabId = 'intro' | 'gym' | 'actions' | 'wifi'

export interface SidebarProps {
  isCollapsed: boolean
  activeTab: TabId
  onSelectTab: (tab: TabId) => void
}

const NAV_TABS = [
  { id: 'intro' as const, key: 'navIntro' as const, Icon: InfoIcon },
  { id: 'gym' as const, key: 'navGym' as const, Icon: DumbbellIcon },
  { id: 'actions' as const, key: 'navActions' as const, Icon: BoltIcon },
  { id: 'wifi' as const, key: 'navWifi' as const, Icon: GearIcon },
]

// Menu điều hướng bên sườn ứng dụng
export const Sidebar: FC<SidebarProps> = ({ isCollapsed, activeTab, onSelectTab }) => {
  const { t } = useTranslation()

  return (
    <aside className={`sidebar-layout ${isCollapsed ? 'sidebar-layout--collapsed' : ''}`}>
      <ul className="sidebar-layout__nav">
        {NAV_TABS.map(({ id, key, Icon }) => (
          <li key={id}>
            <button
              type="button"
              className={`sidebar-layout__link ${
                activeTab === id ? 'sidebar-layout__link--active' : ''
              }`}
              onClick={() => onSelectTab(id)}
              title={t(key)}
            >
              <span className="sidebar-layout__icon">
                <Icon />
              </span>
              <span className="sidebar-layout__text">{t(key)}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
