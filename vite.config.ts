import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

const basePath = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 uses @import, silence deprecation warnings per spec section 8
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  server: {
    port: 3000,
  },
})
