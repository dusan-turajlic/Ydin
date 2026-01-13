import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  server: {
    headers: {
      // Required headers for SharedArrayBuffer (needed for OPFS SQLite storage)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@subframe7536/sqlite-wasm'],
  },
  // Treat WASM files as assets
  assetsInclude: ['**/*.wasm'],
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/**/*.e2e.{ts,tsx}'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
