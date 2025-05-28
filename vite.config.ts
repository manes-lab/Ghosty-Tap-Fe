import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  build: {
    outDir: './build'
  },
  base: './',
  server: {
    port: 8000, 
    open: true, 
    cors: true, 
    host: "0.0.0.0", 
    proxy: {
      "^/api": {
        target: "http://ghostytap.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "^/socket.io": {
        target: "https://ghostytap.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/socket.io/, "/socket.io"),
      },
    },
  },
})
