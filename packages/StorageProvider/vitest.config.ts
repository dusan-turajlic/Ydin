import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'public',
  server: {
    fs: {
      // Allow serving WASM files from sqlite-wasm for browser tests
      allow: [
        resolve(__dirname, 'src'),
        resolve(__dirname, 'node_modules/@subframe7536/sqlite-wasm/dist'),
      ],
    },
  },
  test: {
    globals: true,
    projects: [
      // E2E tests - run in browser with Playwright
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/**/*.e2e.{ts,tsx}'],
          setupFiles: ['src/__test__/setup.ts'],
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

