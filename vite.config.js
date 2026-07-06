import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // These are Node.js modules that cannot run in the browser.
      // We mark them as external so Vite ignores them during the build.
      external: ['path', 'fs', 'url', 'rollup'],
      output: {
        // Ensure globals are handled if needed
        globals: {
          path: 'path',
          fs: 'fs'
        }
      }
    }
  },
  optimizeDeps: {
    // Prevent Vite from trying to pre-bundle these if they appear in your deps
    exclude: ['path', 'fs', 'url', 'rollup']
  }
})
```
eof

### Immediate Action Checklist

1.  **Check your code:** Open `src/App.jsx` and any other files in `src/`. Look for lines that look like:
    * `import path from 'path';`
    * `import fs from 'fs';`
    * `import rollup from 'rollup';`
    * **Delete these lines.** You cannot use these in a React frontend app. If you need functionality from them, you must move that logic into your Netlify function (`netlify/functions/ielts-evaluator.js`).
2.  **Verify `package.json`:** Ensure `rollup` is under `devDependencies`, not `dependencies`. It is a build tool, not a library for your website.
3.  **Clear Local Cache:** Before pushing, run this locally to ensure you aren't fighting a corrupted local cache:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    npm run build
