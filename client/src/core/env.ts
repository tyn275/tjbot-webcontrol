// Cấu hình môi trường công khai phía trình duyệt web
export interface EnvConfig {
  readonly apiUrl: string
  readonly hlsBaseUrl: string
  readonly defaultBotId: string
}

export const env: EnvConfig = {
  apiUrl: __APP_ENV__.API_URL,
  hlsBaseUrl: __APP_ENV__.HLS_BASE_URL,
  defaultBotId: __APP_ENV__.DEFAULT_BOT_ID,
} as const
