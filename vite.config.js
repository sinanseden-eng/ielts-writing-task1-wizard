import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // 1. Prevents fsevents (macOS only) from breaking the build
      // 2. Prevents Node.js built-ins from being bundled for the browser
      external: ['fsevents', 'path', 'fs', 'url', 'rollup']
    }
  },
  optimizeDeps: {
    // Tells Vite to ignore these if found in your dependency tree
    exclude: ['fsevents', 'path', 'fs', 'url', 'rollup']
  }
});
