import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Note: For local dev, Vercel's `vercel dev` command
  // is the best way to run this with the /api folder.
  // If not using `vercel dev`, you'd add a server.proxy here.
})
