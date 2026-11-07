import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import tjbotLogo from '../../assets/tjbot-logo.svg'
import { ConnectionBar } from './ConnectionBar'
import { LanguageSwitcher } from './LanguageSwitcher'

export interface NavbarProps {
  onToggleSidebar: () => void
  botId: string
  isConnected: boolean
  isConnecting?: boolean
  onBotIdChange: (id: string) => void
  onToggleConnect: () => void
}

// Thanh điều hướng chính trên cùng của hệ thống
export const Navbar: FC<NavbarProps> = ({
  onToggleSidebar,
  botId,
  isConnected,
  isConnecting = false,
  onBotIdChange,
  onToggleConnect,
}) => {
  const { t } = useTranslation()

  return (
    <nav className="navbar navbar-dark navbar-custom px-4">
      <div className="container-fluid d-flex align-items-center justify-content-between p-0">
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-light btn-sm me-3 navbar-custom__toggle-btn"
            onClick={onToggleSidebar}
            aria-label={t('toggleSidebar')}
          >
            ☰
          </button>
          <div className="navbar-custom__brand fw-bold text-warning d-flex align-items-center">
            <img src={tjbotLogo} alt="TJBot Logo" width="24" height="24" className="me-2" />
            <span>{t('title')}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <ConnectionBar
            botId={botId}
            isConnected={isConnected}
            isConnecting={isConnecting}
            onBotIdChange={onBotIdChange}
            onToggleConnect={onToggleConnect}
          />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
