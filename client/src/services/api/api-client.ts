import { env } from '../../core/env'

interface CommandResponse {
  readonly success: boolean
  readonly command?: string
  readonly message?: string
}

export interface RobotStatusResponse {
  readonly success: boolean
  readonly connected: boolean
  readonly botId: string
}

export const getRobotStatus = async (): Promise<RobotStatusResponse> => {
  try {
    const res = await fetch(`${env.apiUrl}/api/status`)
    return (await res.json()) as RobotStatusResponse
  } catch {
    return { success: false, connected: false, botId: env.defaultBotId }
  }
}

export const postConnectRobot = async (botId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${env.apiUrl}/api/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botId }),
    })
    const data = (await res.json()) as RobotStatusResponse
    return data.connected
  } catch {
    return false
  }
}

export const postDisconnectRobot = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${env.apiUrl}/api/disconnect`, { method: 'POST' })
    const data = (await res.json()) as RobotStatusResponse
    return !data.connected
  } catch {
    return false
  }
}

export const postRobotCommand = async (botId: string, command: string): Promise<boolean> => {
  try {
    const res = await fetch(`${env.apiUrl}/api/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botId, command }),
    })
    const data = (await res.json()) as CommandResponse
    return data.success
  } catch {
    console.error(`[API] Lỗi kết nối tới Backend khi gửi lệnh: ${command}`)
    return false
  }
}
