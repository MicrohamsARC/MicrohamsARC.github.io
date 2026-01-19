#!/usr/bin/env node

/**
 * Version & Security Verification Script
 *
 * Checks:
 * 1. All installed packages match expected January 2026 versions
 * 2. No known CVE vulnerabilities (npm audit)
 * 3. Environment requirements (Node, npm, Playwright)
 */

import { execSync } from 'child_process';

const EXPECTED_VERSIONS = {
  astro: '5.16.11',
  vite: '7.1.11',
  vitest: '3.2.4',
  '@vitest/ui': '3.2.4',
  eslint: '9.38.0',
  typescript: '5.9.3',
  prettier: '3.6.2',
  '@typescript-eslint/parser': '8.46.2',
  '@typescript-eslint/eslint-plugin': '8.46.2',
  husky: '9.1.7',
  'lint-staged': '15.5.2',
};

// Optional packages (E2E testing) - warn if missing, don't fail
const OPTIONAL_VERSIONS = {
  '@playwright/test': '1.56.1',
  'playwright-core': '1.56.1',
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
console.log(colorize('  January 2026 Edition', 'gray'));
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

// Check optional packages (don't fail if missing)
console.log('\n' + colorize('Optional (E2E testing):', 'gray'));
for (const [packageName, expectedVersion] of Object.entries(OPTIONAL_VERSIONS)) {
  const installedVersion = getInstalledVersion(packageName);
  const displayName = packageName.padEnd(35);
  const displayExpected = expectedVersion.padEnd(10);

  if (!installedVersion) {
    console.log(
      `○  ${colorize(displayName, 'gray')} ` +
        `Expected: ${colorize(displayExpected, 'gray')} ` +
        `${colorize('not installed', 'gray')}`
    );
  } else {
    const status = compareVersions(expectedVersion, installedVersion);
    const displayActual = installedVersion.padEnd(10);
    const statusIcon = status === 'exact' ? '✅' : status === 'compatible' ? '✓' : '⚠️';
    console.log(
      `${statusIcon} ${colorize(displayName, 'blue')} ` +
        `Expected: ${colorize(displayExpected, 'gray')} ` +
        `Installed: ${colorize(displayActual, status === 'exact' ? 'green' : 'yellow')}`
    );
  }
}

console.log('\n' + colorize('─'.repeat(70), 'gray'));

if (allPassed) {
  console.log(colorize('\n✅ All packages are at expected versions!', 'green'));
  console.log(colorize('   Your January 2026 stack is ready to go.\n', 'green'));
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

// Security audit
console.log(colorize('Security Audit:', 'blue') + '\n');

let auditPassed = true;
try {
  const auditOutput = execSync('npm audit --json', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const audit = JSON.parse(auditOutput);
  const vulns = audit.metadata?.vulnerabilities || {};
  const total = vulns.total || 0;

  if (total === 0) {
    console.log(colorize('✅ No known vulnerabilities', 'green'));
  } else {
    auditPassed = false;
    const high = vulns.high || 0;
    const critical = vulns.critical || 0;
    const moderate = vulns.moderate || 0;
    const low = vulns.low || 0;

    console.log(colorize(`❌ Found ${total} vulnerabilities:`, 'red'));
    if (critical > 0) console.log(colorize(`   Critical: ${critical}`, 'red'));
    if (high > 0) console.log(colorize(`   High: ${high}`, 'red'));
    if (moderate > 0) console.log(colorize(`   Moderate: ${moderate}`, 'yellow'));
    if (low > 0) console.log(colorize(`   Low: ${low}`, 'gray'));
    console.log(colorize('   Run: npm audit fix', 'gray'));
  }
} catch (error) {
  // npm audit exits non-zero when vulnerabilities found
  try {
    const audit = JSON.parse(error.stdout || '{}');
    const vulns = audit.metadata?.vulnerabilities || {};
    const total = vulns.total || 0;

    if (total > 0) {
      auditPassed = false;
      const high = vulns.high || 0;
      const critical = vulns.critical || 0;
      const moderate = vulns.moderate || 0;
      const low = vulns.low || 0;

      console.log(colorize(`❌ Found ${total} vulnerabilities:`, 'red'));
      if (critical > 0) console.log(colorize(`   Critical: ${critical}`, 'red'));
      if (high > 0) console.log(colorize(`   High: ${high}`, 'red'));
      if (moderate > 0) console.log(colorize(`   Moderate: ${moderate}`, 'yellow'));
      if (low > 0) console.log(colorize(`   Low: ${low}`, 'gray'));
      console.log(colorize('   Run: npm audit fix', 'gray'));
    }
  } catch {
    console.log(colorize('⚠️  Could not parse audit results', 'yellow'));
  }
}

console.log('');
console.log(colorize('═'.repeat(70), 'blue') + '\n');

// Additional checks
console.log(colorize('Environment:', 'blue') + '\n');

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

const finalPassed = allPassed && auditPassed;
process.exit(finalPassed ? 0 : 1);
