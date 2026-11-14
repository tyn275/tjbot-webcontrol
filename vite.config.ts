import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

const requiredEnvVars = [
  'MQTT_HOST',
  'MQTT_PORT',
  'MQTT_PATH',
  'HLS_BASE_URL',
  'DEFAULT_BOT_ID',
] as const

const missingVars = requiredEnvVars.filter((key) => !process.env[key])

if (missingVars.length > 0) {
  const list = missingVars.join(', ')
  throw new Error(
    `[LỖI MÔI TRƯỜNG] Thiếu biến môi trường bắt buộc: ${list}\n` +
      '- Nội bộ: Khai báo trong file .env\n' +
      '- CI: Cấu hình trong GitHub Repo Settings -> Secrets and variables -> Actions'
  )
}

const basePath = process.env.BASE_PATH || '/'

export default defineConfig({
  base: basePath,
  plugins: [react()],
  define: {
    __APP_ENV__: JSON.stringify({
      MQTT_HOST: process.env.MQTT_HOST,
      MQTT_PORT: Number(process.env.MQTT_PORT),
      MQTT_PATH: process.env.MQTT_PATH,
      MQTT_PASSWORD: process.env.MQTT_PASSWORD || '',
      HLS_BASE_URL: process.env.HLS_BASE_URL,
      DEFAULT_BOT_ID: process.env.DEFAULT_BOT_ID,
      BASE_PATH: basePath,
    }),
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Tắt cảnh báo cú pháp cũ từ thư viện Bootstrap khi biên dịch Sass
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'color-functions',
          'if-function',
        ],
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-i18next', 'i18next'],
          mqtt: ['mqtt'],
        },
      },
    },
  },
})
