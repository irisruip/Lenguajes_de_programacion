import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true, // Permite acceder desde la red
        port: 5173, // Asegúrate de que coincida con el puerto mapeado
        strictPort: true
    },
    plugins: [react()]

});
