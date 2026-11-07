import { useState, type FC, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

export interface ConnectionBarProps {
  botId: string
  isConnected: boolean
  isConnecting?: boolean
  onBotIdChange: (id: string) => void
  onToggleConnect: () => void
}

interface BotIdSelectorProps {
  botId: string
  placeholder: string
  onBotIdChange: (id: string) => void
}

// Khối nhập mã robot kèm dropdown chọn nhanh
const BotIdSelector: FC<BotIdSelectorProps> = ({ botId, placeholder, onBotIdChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleSelect = (id: string) => {
    onBotIdChange(id)
    setIsOpen(false)
  }

  return (
    <div className="input-group input-group-sm position-relative connection-bar__group">
      <input
        type="text"
        className="form-control connection-bar__input"
        value={botId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onBotIdChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="btn btn-outline-warning dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <ul className="dropdown-menu dropdown-menu-end show position-absolute end-0 top-100">
          <li>
            <button type="button" className="dropdown-item" onClick={() => handleSelect('tjbot1')}>
              tjbot1
            </button>
          </li>
          <li>
            <button type="button" className="dropdown-item" onClick={() => handleSelect('tjbot2')}>
              tjbot2
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

// Cụm hiển thị trạng thái kết nối và chọn mã robot
export const ConnectionBar: FC<ConnectionBarProps> = ({
  botId,
  isConnected,
  isConnecting = false,
  onBotIdChange,
  onToggleConnect,
}) => {
  const { t } = useTranslation()
  const statusClass = isConnected ? 'connection-bar__status-dot--connected' : ''

  return (
    <div className="connection-bar d-flex align-items-center gap-2">
      <div className="d-flex align-items-center me-2 text-light">
        <span className={`connection-bar__status-dot me-1 ${statusClass}`} />
        <span className="connection-bar__status-text">
          {isConnected ? t('connected') : t('disconnected')}
        </span>
      </div>
      <BotIdSelector
        botId={botId}
        placeholder={t('botIdPlaceholder')}
        onBotIdChange={onBotIdChange}
      />
      <button
        type="button"
        disabled={isConnecting}
        className={`btn btn-sm fw-bold px-3 connection-bar__btn ${
          isConnected ? 'btn-danger' : 'btn-success'
        } ${isConnecting ? 'connection-bar__btn--connecting' : ''}`}
        onClick={onToggleConnect}
      >
        {isConnected ? t('disconnect') : t('connect')}
      </button>
    </div>
  )
}
