import { defineConfig } from 'vite'
import path from "path"
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['solid-js'],
          beatport: ['@betterpot/betterpot-client']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@betterpot/betterpot-client', '@betterpot/shared-types']
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  }
})