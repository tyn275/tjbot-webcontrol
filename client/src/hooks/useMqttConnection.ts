import { useState, useEffect } from 'react'
import { getRobotStatus, postConnectRobot, postDisconnectRobot } from '../services/api/api-client'
import {
  logStartingNetwork,
  logConnectSuccess,
  logDisconnectedManual,
} from '../services/logger/log.service'
import { env } from '../core/env'

const handleConnectAction = async (botId: string): Promise<boolean> => {
  logStartingNetwork('wss://mqtt.toolhub.app:8084...')
  const connected = await postConnectRobot(botId)
  if (connected) {
    logConnectSuccess(`${botId}/status`)
  }
  return connected
}

const handleDisconnectAction = async (): Promise<boolean> => {
  await postDisconnectRobot()
  logDisconnectedManual()
  return false
}

const useUnloadDisconnect = (isConnected: boolean): void => {
  useEffect(() => {
    const handleUnload = () => {
      if (isConnected) {
        navigator.sendBeacon(`${env.apiUrl}/api/disconnect`)
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [isConnected])
}

const useStatusPolling = (botId: string, onSync: (connected: boolean) => void): void => {
  useEffect(() => {
    const sync = async () => {
      const status = await getRobotStatus()
      onSync(status.connected)
    }
    void sync()
    const timer = setInterval(() => void sync(), 3000)
    return () => clearInterval(timer)
  }, [botId, onSync])
}

export const useMqttConnection = (botId: string) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useStatusPolling(botId, setIsConnected)
  useUnloadDisconnect(isConnected)

  const toggleConnect = async () => {
    if (isConnecting) return
    setIsConnecting(true)
    try {
      const next = isConnected ? await handleDisconnectAction() : await handleConnectAction(botId)
      setIsConnected(next)
    } finally {
      setIsConnecting(false)
    }
  }

  return { isConnected, isConnecting, toggleConnect }
}
