import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    testTimeout: 10000,
    deps: {
      inline: ['@solidjs/testing-library'],
    },
  },
  esbuild: {
    target: 'esnext',
  },
})