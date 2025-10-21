import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for MicroHAMS
 * 
 * Includes visual regression testing, accessibility audits,
 * and design system validation
 */

export default defineConfig({
  // Test directory
  testDir: './playwright',
  
  // Test file patterns
  testMatch: '**/*.spec.ts',
  
  // Fully parallel execution
  fullyParallel: true,
  
  // Fail build on CI if tests were accidentally committed with .only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI for more stable runs
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/playwright' }],
    ['json', { outputFile: 'test-results/playwright/results.json' }],
    ['list'],
  ],
  
  // Shared test configuration
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:4321',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry
    video: 'retain-on-failure',
    
    // Viewport
    viewport: { width: 1280, height: 720 },
    
    // Increased timeout for slow operations
    actionTimeout: 10000,
    
    // Locale
    locale: 'en-US',
    
    // Timezone
    timezoneId: 'America/New_York',
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable experimental features
        launchOptions: {
          args: [
            '--enable-experimental-web-platform-features',
            '--font-render-hinting=none',
          ],
        },
      },
    },
    
    // Visual regression tests - Chromium only for consistency
    {
      name: 'visual-regression',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--font-render-hinting=none',
            '--disable-font-subpixel-positioning',
          ],
        },
      },
      testMatch: '**/*.visual.spec.ts',
    },
    
    // Mobile viewport testing
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/mobile.spec.ts',
    },
    
    // Dark mode testing
    {
      name: 'dark-mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
      testMatch: '**/visual.spec.ts',
    },
  ],
  
  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  
  // Output directory for test artifacts
  outputDir: 'test-results/playwright-artifacts',
  
  // Global timeout
  timeout: 30000,
  
  // Expect timeout
  expect: {
    // Visual comparison tolerance
    toHaveScreenshot: {
      // Strict comparison
      maxDiffPixels: 100,
      // Allow slight color differences
      threshold: 0.2,
    },
    timeout: 5000,
  },
});
