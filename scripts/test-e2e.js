#!/usr/bin/env node

/**
 * E2E Test Runner with Smart Setup
 *
 * Checks for Playwright installation and guides user through setup if needed.
 */

import { execSync, spawnSync } from 'child_process';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function color(text, c) {
  return `${COLORS[c]}${text}${COLORS.reset}`;
}

function checkPlaywrightInstalled() {
  try {
    require.resolve('@playwright/test');
    return true;
  } catch {
    return false;
  }
}

function checkBrowsersInstalled() {
  try {
    const result = spawnSync('npx', ['playwright', 'install', '--dry-run'], {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    // If dry-run shows nothing to install, browsers are installed
    return !result.stdout?.includes('chromium');
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Check if Playwright package is installed
  if (!checkPlaywrightInstalled()) {
    console.log(color('\n⚠️  Playwright is not installed.\n', 'yellow'));
    console.log('E2E tests are optional. To set up Playwright:\n');
    console.log(color('  npm install @playwright/test playwright-core', 'gray'));
    console.log(color('  npx playwright install chromium\n', 'gray'));
    console.log('Then run: npm run test:e2e\n');
    process.exit(0);
  }

  // Check if browsers are installed
  if (!checkBrowsersInstalled()) {
    console.log(color('\n⚠️  Playwright browsers not installed.\n', 'yellow'));
    console.log('Installing Chromium (this may take a minute)...\n');

    try {
      execSync('npx playwright install chromium', { stdio: 'inherit' });
      console.log(color('\n✅ Chromium installed successfully.\n', 'green'));
    } catch (error) {
      console.log(color('\n❌ Failed to install browsers.', 'red'));
      console.log('Try running manually: npx playwright install chromium\n');
      process.exit(1);
    }
  }

  // Run Playwright with any passed arguments
  console.log(color('\nRunning E2E tests...\n', 'blue'));

  const playwrightArgs = ['playwright', 'test', ...args];
  const result = spawnSync('npx', playwrightArgs, {
    stdio: 'inherit',
    env: process.env,
  });

  process.exit(result.status || 0);
}

main();
