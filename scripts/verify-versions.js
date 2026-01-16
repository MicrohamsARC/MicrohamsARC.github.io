#!/usr/bin/env node

/**
 * Version Verification Script
 * 
 * Checks that all installed packages match expected October 2025 versions
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const EXPECTED_VERSIONS = {
  'astro': '5.16.8',
  'vite': '7.1.11',
  'vitest': '3.2.4',
  '@vitest/ui': '3.2.4',
  '@playwright/test': '1.56.1',
  'playwright-core': '1.56.1',
  'eslint': '9.38.0',
  'typescript': '5.9.3',
  'prettier': '3.6.2',
  '@typescript-eslint/parser': '8.46.2',
  '@typescript-eslint/eslint-plugin': '8.46.2',
};

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function getInstalledVersion(packageName) {
  try {
    const output = execSync(`npm list ${packageName} --depth=0 --json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const json = JSON.parse(output);
    const deps = json.dependencies || {};
    return deps[packageName]?.version || null;
  } catch (error) {
    return null;
  }
}

function compareVersions(expected, actual) {
  if (!actual) return 'missing';
  
  // Remove any ^ or ~ prefixes and compare
  const cleanExpected = expected.replace(/^[\^~]/, '');
  const cleanActual = actual.replace(/^[\^~]/, '');
  
  if (cleanActual === cleanExpected) return 'exact';
  
  // Check if actual is compatible (same major.minor)
  const [expMajor, expMinor] = cleanExpected.split('.');
  const [actMajor, actMinor] = cleanActual.split('.');
  
  if (expMajor === actMajor && expMinor === actMinor) return 'compatible';
  
  return 'mismatch';
}

console.log('\n' + colorize('═'.repeat(70), 'blue'));
console.log(colorize('  MicroHAMS Package Version Verification', 'blue'));
console.log(colorize('  October 2025 Edition', 'gray'));
console.log(colorize('═'.repeat(70), 'blue') + '\n');

let allPassed = true;
let missingCount = 0;
let mismatchCount = 0;

for (const [packageName, expectedVersion] of Object.entries(EXPECTED_VERSIONS)) {
  const installedVersion = getInstalledVersion(packageName);
  const status = compareVersions(expectedVersion, installedVersion);
  
  const displayName = packageName.padEnd(35);
  const displayExpected = expectedVersion.padEnd(10);
  const displayActual = (installedVersion || 'NOT INSTALLED').padEnd(10);
  
  let statusIcon;
  let statusColor;
  
  switch (status) {
    case 'exact':
      statusIcon = '✅';
      statusColor = 'green';
      break;
    case 'compatible':
      statusIcon = '✓';
      statusColor = 'yellow';
      break;
    case 'mismatch':
      statusIcon = '❌';
      statusColor = 'red';
      allPassed = false;
      mismatchCount++;
      break;
    case 'missing':
      statusIcon = '⚠️';
      statusColor = 'red';
      allPassed = false;
      missingCount++;
      break;
  }
  
  console.log(
    `${statusIcon} ${colorize(displayName, 'blue')} ` +
    `Expected: ${colorize(displayExpected, 'gray')} ` +
    `Installed: ${colorize(displayActual, statusColor)}`
  );
}

console.log('\n' + colorize('─'.repeat(70), 'gray'));

if (allPassed) {
  console.log(colorize('\n✅ All packages are at expected versions!', 'green'));
  console.log(colorize('   Your October 2025 stack is ready to go.\n', 'green'));
} else {
  console.log(colorize('\n⚠️  Some packages need attention:', 'yellow'));
  
  if (missingCount > 0) {
    console.log(colorize(`   - ${missingCount} package(s) not installed`, 'red'));
    console.log(colorize('   Run: npm install', 'gray'));
  }
  
  if (mismatchCount > 0) {
    console.log(colorize(`   - ${mismatchCount} package(s) version mismatch`, 'red'));
    console.log(colorize('   Run: npm update', 'gray'));
  }
  
  console.log('');
}

console.log(colorize('═'.repeat(70), 'blue') + '\n');

// Additional checks
console.log(colorize('Additional Environment Checks:', 'blue') + '\n');

try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  
  console.log(`${colorize('Node.js:', 'blue')} ${nodeVersion}`);
  console.log(`${colorize('npm:', 'blue')}     ${npmVersion}`);
  
  // Check for Playwright browsers
  try {
    execSync('npx playwright --version', { encoding: 'utf8', stdio: 'ignore' });
    console.log(colorize('Playwright browsers: ✅ Installed', 'green'));
  } catch {
    console.log(colorize('Playwright browsers: ⚠️  Not installed', 'yellow'));
    console.log(colorize('                     Run: npx playwright install chromium', 'gray'));
  }
  
} catch (error) {
  console.log(colorize('Error checking environment', 'red'));
}

console.log('');

process.exit(allPassed ? 0 : 1);
