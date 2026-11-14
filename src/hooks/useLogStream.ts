import { useState, useEffect } from 'react'
import { subscribeLogs } from '../services/logger/log.service'

export const useLogStream = () => {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    return subscribeLogs((entry) => {
      setLogs((prev) => [...prev, entry])
    })
  }, [])

  return { logs }
}
