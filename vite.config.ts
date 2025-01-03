import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @配置别名
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
