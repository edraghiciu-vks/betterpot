import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  assetsInclude: ['**/*.wasm'],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: {
          vendor: ['solid-js'],
          beatport: ['@betterpot/betterpot-client'],
          superpowered: ['@superpoweredsdk/web']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@betterpot/betterpot-client', '@betterpot/shared-types'],
    exclude: ['@superpoweredsdk/web']
  },
  worker: {
    format: 'es'
  }
})