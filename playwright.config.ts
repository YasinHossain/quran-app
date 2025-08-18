import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './visual',
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 800, height: 600 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
