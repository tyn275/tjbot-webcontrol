import mqtt, { type MqttClient, type IPublishPacket } from 'mqtt'
import { env } from '../../core/env'
import {
  logCommandError,
  logCommandSent,
  logConnectSuccess,
  logStatusReceive,
} from '../logger/log.service'
import { normalizeStatusMessage } from './status-formatter'
import { getStatusTopic, getCommandsTopic } from './mqtt-topics'
import { buildInfoCommand } from './command'

type StatusCallback = (connected: boolean) => void
type MessageCallback = (topic: string, message: string) => void

let activeClient: MqttClient | null = null
let activeBotId: string | null = null
const statusListeners = new Set<StatusCallback>()
const messageListeners = new Set<MessageCallback>()

export const isMqttConnected = (): boolean => activeClient?.connected ?? false

export const subscribeMqttStatus = (listener: StatusCallback): (() => void) => {
  statusListeners.add(listener)
  return () => {
    statusListeners.delete(listener)
  }
}

export const subscribeMqttMessage = (listener: MessageCallback): (() => void) => {
  messageListeners.add(listener)
  return () => {
    messageListeners.delete(listener)
  }
}

const notifyStatus = (connected: boolean): void => {
  statusListeners.forEach((fn) => fn(connected))
}

const buildBrokerUrl = (): string => `wss://${env.mqttHost}:${env.mqttPort}${env.mqttPath}`

const buildClientOptions = (botId: string) => ({
  username: botId,
  password: env.mqttPassword,
  clientId: `web-client-${botId}-${Math.random().toString(16).slice(2, 8)}`,
  clean: true,
  reconnectPeriod: 3000,
  connectTimeout: 5000,
})

const dispatchRobotStatus = (topic: string, raw: string): void => {
  logStatusReceive(topic, normalizeStatusMessage(raw))
  messageListeners.forEach((fn) => fn(topic, raw))
}

const bindClientEvents = (client: MqttClient, botId: string): void => {
  const statusTopic = getStatusTopic(botId)
  client.on('connect', () => {
    client.subscribe(statusTopic)
    logConnectSuccess(statusTopic)
    notifyStatus(true)
    client.publish(getCommandsTopic(botId), buildInfoCommand())
  })
  client.on('message', (topic, message, packet: IPublishPacket) => {
    if (packet.retain) return
    dispatchRobotStatus(topic, message.toString())
  })
  client.on('close', () => notifyStatus(false))
  client.on('error', () => notifyStatus(false))
}

const attachMqttListeners = (client: MqttClient, finish: (ok: boolean) => void) => {
  client.once('connect', () => finish(true))
  client.once('error', () => finish(false))
  client.once('close', () => finish(false))
}

const createMqttConnection = (botId: string, resolve: (ok: boolean) => void) => {
  const client = mqtt.connect(buildBrokerUrl(), buildClientOptions(botId))
  activeClient = client
  activeBotId = botId
  let settled = false

  const finish = (ok: boolean) => {
    if (settled) return
    settled = true
    if (!ok) {
      client.end(true)
      activeClient = null
      activeBotId = null
      notifyStatus(false)
    }
    resolve(ok)
  }

  bindClientEvents(client, botId)
  attachMqttListeners(client, finish)
}

export const connectMqtt = async (botId: string): Promise<boolean> => {
  if (activeClient?.connected && activeBotId === botId) return true
  if (activeClient) await disconnectMqtt()
  return new Promise((resolve) => createMqttConnection(botId, resolve))
}

export const disconnectMqtt = async (): Promise<void> => {
  if (!activeClient) return
  return new Promise((resolve) => {
    activeClient?.end(true, {}, () => {
      activeClient = null
      activeBotId = null
      notifyStatus(false)
      resolve()
    })
  })
}

export const publishRobotCommand = (botId: string, command: string): boolean => {
  if (!activeClient?.connected) return false
  activeClient.publish(getCommandsTopic(botId), command)
  return true
}

export const dispatchRobotCommand = (
  botId: string,
  command: string,
  isConnected = true
): boolean => {
  if (!isConnected || !publishRobotCommand(botId, command)) {
    logCommandError(command)
    return false
  }
  logCommandSent(botId, command)
  return true
}
