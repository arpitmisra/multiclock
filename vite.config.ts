import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
base : "multiclock"
export default defineConfig({
  plugins: [react()],
})


