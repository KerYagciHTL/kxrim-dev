import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: { 
    port: 3001, 
    strictPort: true,
    open: true,
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true
  },
  preview:{ 
    port: 3001, 
    strictPort: true,
    open: true,
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true
  }
})
