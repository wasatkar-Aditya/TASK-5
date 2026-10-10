import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from /TASK-5/ rather than the domain root.
  base: process.env.GITHUB_ACTIONS ? '/TASK-5/' : '/',
  plugins: [react()],
})
