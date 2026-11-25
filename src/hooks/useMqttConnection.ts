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
      if (isConnected) void disconnectMqtt()
    }
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [isConnected])
}

const executeToggle = async (
  botId: string,
  isConnected: boolean,
  setConnected: (val: boolean) => void
) => {
  const timeoutPromise = new Promise<boolean>((res) => setTimeout(() => res(false), 8000))
  const actionPromise = isConnected ? handleDisconnect() : handleConnect(botId)
  const next = await Promise.race([actionPromise, timeoutPromise])
  setConnected(next)
}

export const useMqttConnection = (botId: string) => {
  const [isConnected, setIsConnected] = useState(() => isMqttConnected())
  const [isConnecting, setIsConnecting] = useState(false)
  useEffect(() => subscribeMqttStatus(setIsConnected), [])
  useUnloadDisconnect(isConnected)

  const toggleConnect = async () => {
    if (isConnecting) return
    setIsConnecting(true)
    try {
      await executeToggle(botId, isConnected, setIsConnected)
    } finally {
      setIsConnecting(false)
    }
  }

  return { isConnected, isConnecting, toggleConnect }
}
