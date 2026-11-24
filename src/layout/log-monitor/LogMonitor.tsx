import { useEffect, useRef, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { LogEntry } from '../../services/logger/log.service'

export interface LogMonitorProps {
  logs: readonly LogEntry[]
}

// Khung hiển thị nhật ký lệnh hệ thống ở chân trang
export const LogMonitor: FC<LogMonitorProps> = ({ logs }) => {
  const { t } = useTranslation()
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="log-monitor" ref={boxRef}>
      {logs.length === 0 ? (
        <div className="log-monitor__line">{t('readyLog')}</div>
      ) : (
        logs.map((entry) => (
          <div key={entry.id} className="log-monitor__line">
            {entry.message}
          </div>
        ))
      )}
    </div>
  )
}
