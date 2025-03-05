import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080', // URL de tu backend
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [react()]

});
