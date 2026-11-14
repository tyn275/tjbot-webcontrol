import mqtt, { type MqttClient, type IPublishPacket } from 'mqtt'
import { env } from '../../core/env'
import { logConnectSuccess, logStatusReceive } from '../logger/log.service'
import { normalizeStatusMessage } from './status-formatter'

type StatusCallback = (connected: boolean) => void

let activeClient: MqttClient | null = null
const statusListeners = new Set<StatusCallback>()

export const isMqttConnected = (): boolean => {
  return activeClient?.connected ?? false
}

export const subscribeMqttStatus = (listener: StatusCallback): (() => void) => {
  statusListeners.add(listener)
  return () => {
    statusListeners.delete(listener)
  }
}

const notifyStatus = (connected: boolean): void => {
  statusListeners.forEach((fn) => fn(connected))
}

const buildBrokerUrl = (): string => {
  return `wss://${env.mqttHost}:${env.mqttPort}${env.mqttPath}`
}

const buildClientOptions = (botId: string) => {
  const randomSuffix = Math.random().toString(16).slice(2, 8)
  return {
    username: botId,
    password: env.mqttPassword,
    clientId: `web-client-${botId}-${randomSuffix}`,
    clean: true,
    reconnectPeriod: 3000,
    connectTimeout: 5000,
  }
}

const dispatchRobotStatus = (topic: string, raw: string): void => {
  logStatusReceive(topic, normalizeStatusMessage(raw))
}

const bindClientEvents = (client: MqttClient, botId: string): void => {
  const statusTopic = `${botId}/status`

  client.on('connect', () => {
    client.subscribe(statusTopic)
    logConnectSuccess(statusTopic)
    notifyStatus(true)
    client.publish(`${botId}/commands`, 'info')
  })

  client.on('message', (topic, message, packet: IPublishPacket) => {
    if (packet.retain) return
    dispatchRobotStatus(topic, message.toString())
  })

  client.on('close', () => notifyStatus(false))
  client.on('error', () => notifyStatus(false))
}

export const connectMqtt = async (botId: string): Promise<boolean> => {
  if (activeClient?.connected) {
    return true
  }

  return new Promise((resolve) => {
    const url = buildBrokerUrl()
    const options = buildClientOptions(botId)
    const client = mqtt.connect(url, options)
    activeClient = client

    bindClientEvents(client, botId)

    client.once('connect', () => resolve(true))
    client.once('error', () => resolve(false))
  })
}

export const disconnectMqtt = async (): Promise<void> => {
  if (!activeClient) return
  return new Promise((resolve) => {
    activeClient?.end(true, {}, () => {
      activeClient = null
      notifyStatus(false)
      resolve()
    })
  })
}

export const publishRobotCommand = (botId: string, command: string): boolean => {
  if (!activeClient?.connected) {
    return false
  }
  const commandTopic = `${botId}/commands`
  activeClient.publish(commandTopic, command)
  return true
}
