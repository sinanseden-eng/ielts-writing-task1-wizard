import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // 1. Mark Node.js built-ins as external so they are ignored by the browser bundler
      external: ['fs', 'path', 'stream', 'os', 'url', 'https', 'rollup'],
      
      // 2. Explicitly tell Rollup to only look at index.html
      // This stops it from auto-scanning your netlify functions folder
      input: {
        main: './index.html'
      }
    }
  },
  // Ensure the build only processes the 'src' folder
  root: './',
  publicDir: 'public'
});
