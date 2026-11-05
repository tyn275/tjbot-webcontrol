/// <reference types="vite/client" />

interface AppEnv {
  readonly MQTT_HOST: string
  readonly MQTT_PORT: number
  readonly MQTT_PATH: string
  readonly MQTT_PASSWORD: string
  readonly RTSP_PUSH_BASE: string
  readonly HLS_BASE_URL: string
  readonly DEFAULT_BOT_ID: string
  readonly BASE_PATH: string
}

declare const __APP_ENV__: AppEnv
