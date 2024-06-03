/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@hipster/experimental-vitest-plugin-sb';

import viteConfig from './vite.config';

// https://vitejs.dev/config/
export default mergeConfig(
  viteConfig,
  // @ts-expect-error TODO fix the type issue in the plugin
  defineConfig({
    plugins: [
      // @ts-expect-error TODO fix the type issue in the plugin
      storybookTest(),
    ],
    server: {
      watch: {
        ignored: ['**/.test-results.json'],
      },
    },
    test: {
      clearMocks: true,
      setupFiles: './setupTests.ts',
      environment: 'happy-dom',
    },
  })
);
