import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'food/**/*'],
      manifest: {
        name: 'PeakFam Food Tracker',
        short_name: 'Food Tracker',
        description: 'Track your daily nutrition and food intake',
        theme_color: '#0a0a0b',
        background_color: '#0a0a0b',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ydin/storage-provider': path.resolve(__dirname, '../StorageProvider/src'),
    },
  },
  test: {
    globals: true,
    projects: [
      // Unit tests - run with jsdom
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.{spec,test}.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/*.e2e.*'],
          environment: 'jsdom',
          setupFiles: './src/test/setup.ts',
        },
      },
      // E2E tests - run in browser with Playwright
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['**/*.e2e.{ts,tsx}'],
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
  optimizeDeps: {
    exclude: ['@preflower/barcode-detector-polyfill', '@subframe7536/sqlite-wasm']
  },
  assetsInclude: ['**/*.wasm'],
})
