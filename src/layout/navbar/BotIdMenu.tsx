import type { FC } from 'react'

export interface BotIdMenuProps {
  readonly isOpen: boolean
  readonly disabled: boolean
  readonly recentBotIds: readonly string[]
  readonly onSelect: (id: string) => void
}

// Danh sách thả xuống hiển thị các mã robot đã kết nối gần đây
export const BotIdMenu: FC<BotIdMenuProps> = ({ isOpen, disabled, recentBotIds, onSelect }) => {
  if (!isOpen || recentBotIds.length === 0) return null
  return (
    <ul className="dropdown-menu dropdown-menu-end show position-absolute end-0 top-100">
      {recentBotIds.map((id) => (
        <li key={id}>
          <button
            type="button"
            className="dropdown-item"
            disabled={disabled}
            onClick={() => onSelect(id)}
          >
            {id}
          </button>
        </li>
      ))}
    </ul>
  )
}
