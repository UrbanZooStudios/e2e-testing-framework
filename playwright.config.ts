import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',  // Adjust if your test directory is different
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html', // Generates an HTML report
  use: {
    trace: 'on-first-retry', // Enables tracing for debugging
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
