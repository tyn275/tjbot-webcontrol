import { useState, useEffect } from 'react'
import {
  connectMqtt,
  disconnectMqtt,
  subscribeMqttStatus,
  isMqttConnected,
} from '../services/mqtt/mqtt-client'
import { logStartingNetwork, logDisconnectedManual } from '../services/logger/log.service'
import { env } from '../core/env'

const handleConnect = async (botId: string): Promise<boolean> => {
  logStartingNetwork(`wss://${env.mqttHost}:${env.mqttPort}...`)
  return connectMqtt(botId)
}

const handleDisconnect = async (): Promise<boolean> => {
  await disconnectMqtt()
  logDisconnectedManual()
  return false
}

const useUnloadDisconnect = (isConnected: boolean): void => {
  useEffect(() => {
    const handleUnload = () => {
      if (isConnected) {
        void disconnectMqtt()
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

export const useMqttConnection = (botId: string) => {
  const [isConnected, setIsConnected] = useState(() => isMqttConnected())
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    return subscribeMqttStatus(setIsConnected)
  }, [])

  useUnloadDisconnect(isConnected)

  const toggleConnect = async () => {
    if (isConnecting) return
    setIsConnecting(true)
    try {
      const next = isConnected ? await handleDisconnect() : await handleConnect(botId)
      setIsConnected(next)
    } finally {
      setIsConnecting(false)
    }
  }

  return { isConnected, isConnecting, toggleConnect }
}
