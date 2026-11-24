import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type ChangeEvent,
  type RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'
import { BotIdMenu } from './BotIdMenu'

export interface ConnectionBarProps {
  readonly botId: string
  readonly recentBotIds: readonly string[]
  readonly isConnected: boolean
  readonly isConnecting?: boolean
  readonly onBotIdChange: (id: string) => void
  readonly onToggleConnect: () => void
}

interface BotIdSelectorProps {
  readonly botId: string
  readonly recentBotIds: readonly string[]
  readonly placeholder: string
  readonly disabled: boolean
  readonly onBotIdChange: (id: string) => void
}

const isBotIdDisabled = (isConnected: boolean, isConnecting: boolean): boolean =>
  isConnected || isConnecting

const useClickOutside = (ref: RefObject<HTMLElement | null>, onClose: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, onClose])
}

const useDropdownState = (disabled: boolean) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  useClickOutside(ref, close)
  useEffect(() => {
    if (disabled) close()
  }, [disabled, close])

  return { isOpen, ref, close, toggle }
}

// Khối nhập mã robot kèm dropdown chọn nhanh từ lịch sử
const BotIdSelector: FC<BotIdSelectorProps> = ({
  botId,
  placeholder,
  disabled,
  recentBotIds,
  onBotIdChange,
}) => {
  const { isOpen, ref, close, toggle } = useDropdownState(disabled)
  const hasRecent = recentBotIds.length > 0

  const handleSelect = (id: string) => {
    onBotIdChange(id)
    close()
  }

  return (
    <div ref={ref} className="input-group input-group-sm position-relative connection-bar__group">
      <input
        type="text"
        className="form-control connection-bar__input"
        value={botId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onBotIdChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hasRecent && (
        <button
          type="button"
          className="btn btn-outline-warning dropdown-toggle"
          disabled={disabled}
          onClick={toggle}
        />
      )}
      <BotIdMenu
        isOpen={isOpen}
        disabled={disabled}
        recentBotIds={recentBotIds}
        onSelect={handleSelect}
      />
    </div>
  )
}

// Cụm hiển thị trạng thái kết nối và chọn mã robot
export const ConnectionBar: FC<ConnectionBarProps> = ({
  botId,
  recentBotIds,
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
        recentBotIds={recentBotIds}
        placeholder={t('botIdPlaceholder')}
        disabled={isBotIdDisabled(isConnected, isConnecting)}
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
        {isConnecting ? t('connecting') : isConnected ? t('disconnect') : t('connect')}
      </button>
    </div>
  )
}
