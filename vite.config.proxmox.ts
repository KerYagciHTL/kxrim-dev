import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxmox-specific configuration
// This config is for deployment on the teacher's Proxmox server (10.9.14.x)
// The site will be accessible at http://10.9.14.x/kxrim/
export default defineConfig({
  base: '/kxrim/',  // Change this to match your Proxmox subdirectory
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
