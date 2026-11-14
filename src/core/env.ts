// Cấu hình môi trường công khai phía trình duyệt web
export interface EnvConfig {
  readonly mqttHost: string
  readonly mqttPort: number
  readonly mqttPath: string
  readonly mqttPassword: string
  readonly hlsBaseUrl: string
  readonly defaultBotId: string
  readonly basePath: string
}

export const env: EnvConfig = {
  mqttHost: __APP_ENV__.MQTT_HOST,
  mqttPort: __APP_ENV__.MQTT_PORT,
  mqttPath: __APP_ENV__.MQTT_PATH,
  mqttPassword: __APP_ENV__.MQTT_PASSWORD,
  hlsBaseUrl: __APP_ENV__.HLS_BASE_URL,
  defaultBotId: __APP_ENV__.DEFAULT_BOT_ID,
  basePath: __APP_ENV__.BASE_PATH,
} as const
