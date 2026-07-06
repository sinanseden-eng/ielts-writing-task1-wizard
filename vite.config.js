import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optimized configuration for deployment
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
