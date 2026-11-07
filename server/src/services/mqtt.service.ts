import mqtt, { type MqttClient, type IPublishPacket } from 'mqtt'
import { getServerConfig } from '../config/env.js'
import { broadcastRobotStatus } from './sse.service.js'
import { normalizeStatusMessage } from './status-formatter.js'

let client: MqttClient | null = null
let currentBotId = 'tjbot1'

const setupMqttListeners = (targetClient: MqttClient, botId: string): void => {
  targetClient.on('connect', () => {
    console.log(`[MQTT] Kết nối Broker thành công với BotId [${botId}].`)
    targetClient.subscribe(`${botId}/status`, (err) => {
      if (!err) {
        console.log(`[MQTT] Đã đăng ký lắng nghe phản hồi từ Robot tại [${botId}/status]`)
        targetClient.publish(`${botId}/commands`, 'info')
      }
    })
  })

  targetClient.on('message', (topic, message, packet: IPublishPacket) => {
    if (packet.retain) return
    const rawText = message.toString()
    const text = normalizeStatusMessage(rawText)
    console.log(`[MQTT] Phản hồi từ Robot [${topic}]: ${text}`)
    broadcastRobotStatus(topic, text)
  })

  targetClient.on('error', (err) => {
    console.error('[MQTT] Lỗi kết nối Broker:', err.message)
  })
}

export const connectMqttClient = (botId?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (client?.connected) return resolve(true)
    const config = getServerConfig()
    currentBotId = botId || config.defaultBotId
    const brokerUrl = `wss://${config.mqttHost}:${config.mqttPort}${config.mqttPath}`
    const randId = Math.random().toString(16).slice(2, 6)

    client = mqtt.connect(brokerUrl, {
      username: currentBotId,
      password: config.mqttPassword || 'sinno',
      clientId: `web-client-${currentBotId}-${randId}`,
      rejectUnauthorized: false,
    })

    setupMqttListeners(client, currentBotId)
    client.once('connect', () => resolve(true))
    client.once('error', () => resolve(false))
  })
}

export const isMqttConnected = (): boolean => Boolean(client?.connected)
export const getCurrentBotId = (): string => currentBotId

export const disconnectMqttClient = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!client) return resolve(true)
    client.end(true, () => {
      client = null
      console.log(`[MQTT] Đã ngắt kết nối Broker hoàn toàn theo lệnh người dùng.`)
      resolve(true)
    })
  })
}

export const publishRobotCommand = (botId: string, command: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!client?.connected) {
      console.warn(`[MQTT] Từ chối gửi lệnh [${command}]: Robot [${botId}] đang ngắt kết nối.`)
      resolve(false)
      return
    }
    const topic = `${botId}/commands`
    client.publish(topic, command, { qos: 0 }, (err) => {
      if (err) {
        console.error(`[MQTT] Lỗi gửi lệnh tới ${topic}:`, err.message)
        resolve(false)
        return
      }
      console.log(`[MQTT] Đã gửi lệnh [${command}] tới kênh [${topic}]`)
      resolve(true)
    })
  })
}
