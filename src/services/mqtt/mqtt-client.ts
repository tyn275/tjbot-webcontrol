import mqtt, { type MqttClient, type IPublishPacket } from 'mqtt'
import { env } from '../../core/env'
import {
  logCommandError,
  logCommandSent,
  logConnectSuccess,
  logStatusReceive,
} from '../logger/log.service'
import { normalizeStatusMessage } from './status-formatter'

type StatusCallback = (connected: boolean) => void
type MessageCallback = (topic: string, message: string) => void

let activeClient: MqttClient | null = null
let activeBotId: string | null = null
const statusListeners = new Set<StatusCallback>()
const messageListeners = new Set<MessageCallback>()

export const isMqttConnected = (): boolean => {
  return activeClient?.connected ?? false
}

export const subscribeMqttStatus = (listener: StatusCallback): (() => void) => {
  statusListeners.add(listener)
  return () => {
    statusListeners.delete(listener)
  }
}

// Đăng ký nhận thông điệp MQTT thô từ robot kèm cơ chế hủy lắng nghe
export const subscribeMqttMessage = (listener: MessageCallback): (() => void) => {
  messageListeners.add(listener)
  return () => {
    messageListeners.delete(listener)
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
  messageListeners.forEach((fn) => fn(topic, raw))
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
  if (activeClient?.connected && activeBotId === botId) {
    return true
  }

  if (activeClient) await disconnectMqtt()

  return new Promise((resolve) => {
    const url = buildBrokerUrl()
    const options = buildClientOptions(botId)
    const client = mqtt.connect(url, options)
    activeClient = client
    activeBotId = botId

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
      activeBotId = null
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

// Chỉ ghi nhận lệnh đã gửi khi MQTT client còn kết nối và chấp nhận publish.
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
