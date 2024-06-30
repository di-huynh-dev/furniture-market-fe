import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // server: {
  //   port: 3000,
  // },

  plugins: [react(), tsconfigPaths()],
  build: { chunkSizeWarningLimit: 1600 },
})
