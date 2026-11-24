import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly command: string
}

// Khung hiển thị chuỗi lệnh xuất của phân hệ Microphone
export const MicCommandLog: FC<Props> = ({ command }) => {
  const { t } = useTranslation()
  const displayCommand = command || t('mic.waiting')

  return (
    <div className="text-muted mt-2 mic__log" title={displayCommand}>
      {t('mic.commandOutput')} <span className="text-primary fw-bold">{displayCommand}</span>
    </div>
  )
}
