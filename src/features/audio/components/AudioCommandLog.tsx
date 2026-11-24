import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly command: string
}

// Khung hiển thị nhật ký lệnh xuất của phân hệ âm thanh
export const AudioCommandLog: FC<Props> = ({ command }) => {
  const { t } = useTranslation()
  const displayCommand = command || t('audio.waiting')

  return (
    <div className="text-muted mt-2 audio__log" title={displayCommand}>
      {t('audio.commandOutput')} <span className="text-primary fw-bold">{displayCommand}</span>
    </div>
  )
}
