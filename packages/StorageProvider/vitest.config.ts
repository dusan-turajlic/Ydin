import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  publicDir: 'public',
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

