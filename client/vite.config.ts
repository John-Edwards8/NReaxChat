import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  define: {
    global: {},
  },
    server: {
        proxy: {
            '/chat/messages/room': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/chat/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/auth/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    }
})
