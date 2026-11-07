import { useState, useEffect } from 'react'
import { subscribeLogs } from '../services/logger/log.service'
import { initSseRobotStatus } from '../services/api/sse-client'

export const useLogStream = () => {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = subscribeLogs((entry) => {
      setLogs((prev) => [...prev, entry])
    })
    const closeSse = initSseRobotStatus()
    return () => {
      unsubscribe()
      closeSse()
    }
  }, [])

  return { logs }
}
