import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import svgo from 'vite-plugin-svgo'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imagetools(), svgo({
    svgoOptions: {
      plugins: [
        { name: 'removeViewBox', active: false },
        { name: 'cleanupIDs', active: true },
        { name: 'removeDimensions', active: true },
      ],
    },
  })],
  base: '/',
  optimizeDeps: { exclude: ['fsevents'] },
})
