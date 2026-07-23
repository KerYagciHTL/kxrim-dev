import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // three.js is large; keep it (and everything that depends on it) in a
    // separate chunk that is only fetched when the scene lazy-loads.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/three/') ||
            id.includes('node_modules/@react-three/') ||
            id.includes('node_modules/postprocessing/')
          ) {
            return 'three'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
})
