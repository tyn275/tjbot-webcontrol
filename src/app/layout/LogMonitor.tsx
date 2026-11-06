import { useEffect, useRef, type FC } from 'react'
import { useTranslation } from 'react-i18next'

export interface LogMonitorProps {
  logs: readonly string[]
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
        logs.map((line, index) => (
          <div key={index} className="log-monitor__line">
            {line}
          </div>
        ))
      )}
    </div>
  )
}
