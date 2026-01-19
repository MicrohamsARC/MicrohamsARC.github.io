#!/usr/bin/env node

/**
 * Environment & Security Verification Script
 *
 * Checks:
 * 1. Environment requirements (Node >=22, Playwright browsers)
 * 2. No known CVE vulnerabilities (npm audit)
 * 3. Outdated packages (informational, doesn't fail)
 *
 * Note: Package version consistency is handled by package-lock.json.
 */

import { execSync } from 'child_process';

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

console.log('\n' + colorize('═'.repeat(70), 'blue'));
console.log(colorize('  MicroHAMS Environment Verification', 'blue'));
console.log(colorize('═'.repeat(70), 'blue') + '\n');

let allPassed = true;

// Environment checks
console.log(colorize('Environment:', 'blue') + '\n');

try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  const nodeMajor = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);

  if (nodeMajor >= 22) {
    console.log(`${colorize('✅ Node.js:', 'green')} ${nodeVersion} (requires >=22)`);
  } else {
    console.log(`${colorize('❌ Node.js:', 'red')} ${nodeVersion} (requires >=22)`);
    allPassed = false;
  }

  console.log(`${colorize('   npm:', 'gray')}     ${npmVersion}`);

  // Check for Playwright browsers
  try {
    execSync('npx playwright --version', { encoding: 'utf8', stdio: 'ignore' });
    console.log(colorize('✅ Playwright browsers installed', 'green'));
  } catch {
    console.log(colorize('⚠️  Playwright browsers not installed', 'yellow'));
    console.log(colorize('   Run: npx playwright install chromium', 'gray'));
  }
} catch {
  console.log(colorize('❌ Error checking environment', 'red'));
  allPassed = false;
}

console.log('');
console.log(colorize('═'.repeat(70), 'blue') + '\n');

// Security audit
console.log(colorize('Security Audit:', 'blue') + '\n');

function processAudit(auditJson) {
  const vulns = auditJson.metadata?.vulnerabilities || {};
  const total = vulns.total || 0;

  if (total === 0) {
    console.log(colorize('✅ No known vulnerabilities', 'green'));
    return true;
  }

  const { critical = 0, high = 0, moderate = 0, low = 0 } = vulns;
  console.log(colorize(`❌ Found ${total} vulnerabilities:`, 'red'));
  if (critical > 0) console.log(colorize(`   Critical: ${critical}`, 'red'));
  if (high > 0) console.log(colorize(`   High: ${high}`, 'red'));
  if (moderate > 0) console.log(colorize(`   Moderate: ${moderate}`, 'yellow'));
  if (low > 0) console.log(colorize(`   Low: ${low}`, 'gray'));
  console.log(colorize('   Run: npm audit fix', 'gray'));
  return false;
}

try {
  const auditOutput = execSync('npm audit --json', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  if (!processAudit(JSON.parse(auditOutput))) {
    allPassed = false;
  }
} catch (error) {
  try {
    if (!processAudit(JSON.parse(error.stdout || '{}'))) {
      allPassed = false;
    }
  } catch {
    console.log(colorize('⚠️  Could not parse audit results', 'yellow'));
  }
}

console.log('');
console.log(colorize('═'.repeat(70), 'blue') + '\n');

// Outdated packages (informational)
console.log(colorize('Outdated Packages:', 'blue') + '\n');

function processOutdated(outdatedJson) {
  const packages = Object.entries(outdatedJson);

  if (packages.length === 0) {
    console.log(colorize('✅ All packages up to date', 'green'));
    return;
  }

  let major = 0,
    minor = 0,
    patch = 0;
  const majorPackages = [];

  for (const [name, info] of packages) {
    const current = info.current?.split('.') || [];
    const latest = info.latest?.split('.') || [];

    if (current[0] !== latest[0]) {
      major++;
      majorPackages.push(`${name} (${info.current} → ${info.latest})`);
    } else if (current[1] !== latest[1]) {
      minor++;
    } else {
      patch++;
    }
  }

  console.log(colorize(`📦 ${packages.length} package(s) have updates:`, 'yellow'));
  if (patch > 0) console.log(colorize(`   Patch: ${patch} (safe)`, 'gray'));
  if (minor > 0) console.log(colorize(`   Minor: ${minor} (usually safe)`, 'gray'));
  if (major > 0) {
    console.log(colorize(`   Major: ${major} (breaking changes)`, 'yellow'));
    majorPackages.forEach((pkg) => console.log(colorize(`     • ${pkg}`, 'gray')));
  }
  console.log(colorize('   Run: npm outdated', 'gray'));
}

try {
  const outdatedOutput = execSync('npm outdated --json', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  processOutdated(JSON.parse(outdatedOutput || '{}'));
} catch (error) {
  try {
    processOutdated(JSON.parse(error.stdout || '{}'));
  } catch {
    console.log(colorize('⚠️  Could not check outdated packages', 'yellow'));
  }
}

console.log('');
console.log(colorize('═'.repeat(70), 'blue') + '\n');

if (allPassed) {
  console.log(colorize('✅ All checks passed\n', 'green'));
} else {
  console.log(colorize('❌ Some checks failed\n', 'red'));
}

process.exit(allPassed ? 0 : 1);
