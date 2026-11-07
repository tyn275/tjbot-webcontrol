/// <reference types="vite/client" />

interface AppEnv {
  readonly API_URL: string
  readonly HLS_BASE_URL: string
  readonly DEFAULT_BOT_ID: string
}

declare const __APP_ENV__: AppEnv
