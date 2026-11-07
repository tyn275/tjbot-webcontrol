import type { ServerResponse } from 'node:http'
import {
  publishRobotCommand,
  isMqttConnected,
  getCurrentBotId,
  disconnectMqttClient,
  connectMqttClient,
} from '../services/mqtt.service.js'

interface CommandPayload {
  readonly botId: string
  readonly command: string
}

interface ConnectPayload {
  readonly botId?: string
}

export const handleGetStatus = (res: ServerResponse): void => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      success: true,
      connected: isMqttConnected(),
      botId: getCurrentBotId(),
    })
  )
}

export const handlePostConnect = async (body: string, res: ServerResponse): Promise<void> => {
  const payload = body ? (JSON.parse(body) as ConnectPayload) : {}
  const connected = await connectMqttClient(payload.botId)
  res.writeHead(connected ? 200 : 500, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ success: connected, connected, botId: getCurrentBotId() }))
}

export const handlePostDisconnect = async (res: ServerResponse): Promise<void> => {
  await disconnectMqttClient()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ success: true, connected: false }))
}

export const handlePostCommand = async (body: string, res: ServerResponse): Promise<void> => {
  if (!isMqttConnected()) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({ success: false, message: 'Robot chưa kết nối. Vui lòng bấm Kết nối.' })
    )
    return
  }
  try {
    const payload = JSON.parse(body) as CommandPayload
    const isSuccess = await publishRobotCommand(payload.botId, payload.command)
    res.writeHead(isSuccess ? 200 : 500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: isSuccess, command: payload.command }))
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: false, message: 'Dữ liệu không hợp lệ' }))
  }
}
