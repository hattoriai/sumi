import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:6006', headless: true },
  webServer: {
    command: 'node tests/serve.cjs',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env.CI,
  },
});
