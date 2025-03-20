import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true
        },
        host: true,
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': { // Cambia según el prefijo de tus rutas del backend
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        }
    }
});