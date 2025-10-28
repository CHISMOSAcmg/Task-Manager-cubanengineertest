import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  // Configuración para build de producción
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
     terserOptions: {
      compress: {
        drop_console: true,  // Remover console.log en producción
      },
    },
  },
  // Configuración base para despliegue
  base: './',
})