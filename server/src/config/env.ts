import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })

export interface ServerConfig {
  readonly port: number
  readonly mqttHost: string
  readonly mqttPort: number
  readonly mqttPath: string
  readonly mqttPassword?: string
  readonly defaultBotId: string
}

export const getServerConfig = (): ServerConfig => {
  return {
    port: Number(process.env.PORT) || 5000,
    mqttHost: process.env.MQTT_HOST || 'mqtt.toolhub.app',
    mqttPort: Number(process.env.MQTT_PORT) || 8084,
    mqttPath: process.env.MQTT_PATH || '/mqtt',
    mqttPassword: process.env.MQTT_PASSWORD || 'sinno',
    defaultBotId: process.env.DEFAULT_BOT_ID || 'tjbot1',
  }
}
