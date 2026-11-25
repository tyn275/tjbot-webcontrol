import { useState, useEffect } from 'react'
import { subscribeLogs, type LogEntry } from '../services/logger/log.service'

const LOG_RETENTION_MS = 3 * 60 * 1000
const LOG_CLEANUP_INTERVAL_MS = 5 * 1000
const MAX_LOG_ENTRIES = 100

const removeExpiredLogs = (logs: LogEntry[], now: number): LogEntry[] => {
  const filtered = logs
    .filter((entry) => now - entry.createdAt < LOG_RETENTION_MS)
    .slice(-MAX_LOG_ENTRIES)
  return filtered.length === logs.length ? logs : filtered
}

export const useLogStream = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    return subscribeLogs((entry) => {
      setLogs((prev) => [...removeExpiredLogs(prev, Date.now()), entry].slice(-MAX_LOG_ENTRIES))
    })
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLogs((prev) => removeExpiredLogs(prev, Date.now()))
    }, LOG_CLEANUP_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [])

  return { logs }
}
