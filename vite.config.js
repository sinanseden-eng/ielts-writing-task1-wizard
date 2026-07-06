import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // This tells Rollup to ignore fsevents entirely, 
      // preventing the resolution error on Netlify's Linux environment.
      external: ['fsevents']
    }
  }
})
