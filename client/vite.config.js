import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
            nodePolyfills()],
  server: {
    proxy: {
      '/user': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false
      },
      '/jwt': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false
      }

    }
  }
})
