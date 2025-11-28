import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxmox-specific configuration for ROOT deployment
// This config is for deployment on the teacher's Proxmox server (10.9.14.x)
// The site will be accessible at http://10.9.14.x/
export default defineConfig({
  base: '/',  // Serving from root directory
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
  server: { port: 3000, open: true },
  preview:{ port: 4173, open: true }
})
