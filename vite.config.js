import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'resume-builder-backend-dgu51rgig-kawsarnks-projects.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'resume-builder-backend-dgu51rgig-kawsarnks-projects.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
