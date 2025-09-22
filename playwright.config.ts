import * as dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables from .env

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/',  // Adjust if your test directory is different
  testIgnore: ['**/EFL/**'],  // Ignore the EFL folder

  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
  reporter: [['junit', { outputFile: 'results.xml' }]],
  //reporter: 'html', // Generates an HTML report
  use: {
    trace: 'on-first-retry', // Enables tracing for debugging
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
