import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import tjbotLogo from '../../assets/tjbot-logo.svg'
import { ConnectionBar } from './ConnectionBar'
import { LanguageSwitcher } from './LanguageSwitcher'

export interface NavbarProps {
  readonly onToggleSidebar: () => void
  readonly botId: string
  readonly recentBotIds: readonly string[]
  readonly isConnected: boolean
  readonly isConnecting?: boolean
  readonly onBotIdChange: (id: string) => void
  readonly onToggleConnect: () => void
}

interface BrandProps {
  readonly onToggleSidebar: () => void
  readonly label: string
  readonly title: string
}

// Khối nút điều khiển thanh bên và biểu trưng thương hiệu hệ thống
const NavbarBrand: FC<BrandProps> = ({ onToggleSidebar, label, title }) => (
  <div className="d-flex align-items-center">
    <button
      type="button"
      className="btn btn-outline-light btn-sm me-3 navbar-custom__toggle-btn"
      onClick={onToggleSidebar}
      aria-label={label}
    >
      ☰
    </button>
    <div className="navbar-custom__brand fw-bold text-warning d-flex align-items-center">
      <img src={tjbotLogo} alt="TJBot Logo" width="24" height="24" className="me-2" />
      <span>{title}</span>
    </div>
  </div>
)

// Thanh điều hướng chính trên cùng của hệ thống
export const Navbar: FC<NavbarProps> = (props) => {
  const { t } = useTranslation()
  const { onToggleSidebar, ...connProps } = props

  return (
    <nav className="navbar navbar-dark navbar-custom px-3 px-sm-4">
      <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap gap-2 p-0">
        <NavbarBrand
          onToggleSidebar={onToggleSidebar}
          label={t('toggleSidebar')}
          title={t('title')}
        />
        <div className="d-flex align-items-center flex-wrap gap-2">
          <ConnectionBar {...connProps} />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
