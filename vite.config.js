import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
    host: '127.0.0.1'
  },
  plugins: [react()],
})
