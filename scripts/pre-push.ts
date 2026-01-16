#!/usr/bin/env npx tsx

/**
 * Pre-Push Validation Script
 * 
 * Comprehensive validation that mirrors full CI but runs locally.
 * Use this before `git push` to catch issues early, especially when
 * GitHub free plan limits CI minutes.
 * 
 * Stages:
 * 1. Static Analysis - lint, type-check
 * 2. Unit Tests - fast, no external dependencies
 * 3. Build - ensures site compiles
 * 4. E2E Tests - browser tests against built site
 * 5. Content Validation - accessibility, design system checks
 * 
 * Usage:
 *   npm run pre-push             # Full validation
 *   npm run pre-push -- --fast   # Skip e2e tests
 *   npm run pre-push -- --fix    # Auto-fix what's possible
 *   npm run pre-push -- --docker # Run Playwright in Docker (no local browser deps)
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const c = (text: string, color: keyof typeof colors) => `${colors[color]}${text}${colors.reset}`;

interface StageResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
}

const results: StageResult[] = [];
const args = process.argv.slice(2);
const isFast = args.includes('--fast');
const shouldFix = args.includes('--fix');
const isDocker = args.includes('--docker');
const isVerbose = args.includes('--verbose') || args.includes('-v');

function header(title: string) {
  const line = '═'.repeat(70);
  console.log(`\n${c(line, 'blue')}`);
  console.log(c(`  ${title}`, 'bold'));
  console.log(`${c(line, 'blue')}\n`);
}

function stageHeader(stage: number, total: number, name: string) {
  console.log(`\n${c(`[${stage}/${total}]`, 'cyan')} ${c(name, 'bold')}`);
  console.log(c('─'.repeat(50), 'gray'));
}

function run(command: string, options: { cwd?: string; silent?: boolean } = {}): boolean {
  try {
    if (isVerbose || !options.silent) {
      console.log(c(`$ ${command}`, 'gray'));
    }
    execSync(command, {
      cwd: options.cwd || process.cwd(),
      stdio: isVerbose ? 'inherit' : 'pipe',
      encoding: 'utf-8',
    });
    return true;
  } catch (error: any) {
    if (isVerbose) {
      console.error(error.stdout || error.message);
    }
    return false;
  }
}

function runWithOutput(command: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { success: true, output };
  } catch (error: any) {
    return { success: false, output: error.stdout || error.stderr || error.message };
  }
}

async function stage(
  name: string,
  fn: () => Promise<boolean> | boolean,
  skip: boolean = false
): Promise<boolean> {
  if (skip) {
    results.push({ name, status: 'skip', duration: 0 });
    console.log(`${c('SKIP', 'yellow')} ${name}`);
    return true;
  }

  const startTime = Date.now();
  try {
    const success = await fn();
    const duration = Date.now() - startTime;
    results.push({ name, status: success ? 'pass' : 'fail', duration });
    
    if (success) {
      console.log(`${c('✓', 'green')} ${name} ${c(`(${(duration/1000).toFixed(1)}s)`, 'gray')}`);
    } else {
      console.log(`${c('✗', 'red')} ${name} ${c(`(${(duration/1000).toFixed(1)}s)`, 'gray')}`);
    }
    return success;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    results.push({ name, status: 'fail', duration, error: error.message });
    console.log(`${c('✗', 'red')} ${name} - ${error.message}`);
    return false;
  }
}

// ============================================================================
// Validation Stages
// ============================================================================

async function checkGitStatus(): Promise<boolean> {
  // Check for uncommitted changes (warning only)
  const result = runWithOutput('git status --porcelain');
  if (result.output.trim()) {
    console.log(c('Warning: Uncommitted changes detected', 'yellow'));
    if (isVerbose) {
      console.log(result.output);
    }
  }
  return true;
}

async function runLint(): Promise<boolean> {
  const command = shouldFix 
    ? 'npm run lint:fix'
    : 'npm run lint';
  return run(command);
}

async function runTypeCheck(): Promise<boolean> {
  return run('npm run type-check');
}

async function runUnitTests(): Promise<boolean> {
  return run('npm run test:unit');
}

async function runBuild(): Promise<boolean> {
  return run('npm run build');
}

async function runE2ETests(): Promise<boolean> {
  if (isDocker) {
    // Run E2E tests in Docker container (Playwright browsers pre-installed)
    return run('npm run docker:e2e');
  }
  // Start preview server and run e2e tests locally
  return run('npm run test:e2e');
}

async function runVisualTests(): Promise<boolean> {
  if (isDocker) {
    // Visual tests are slow in Docker (~5min) - skip in pre-push, run in CI
    console.log('Skipping visual tests in Docker mode (run in CI instead)');
    return true;
  }
  return run('npm run test:visual');
}

async function runContentValidation(): Promise<boolean> {
  // Check for the AI validation script
  const scriptPath = resolve(process.cwd(), 'scripts/ai-validate.ts');
  if (!existsSync(scriptPath)) {
    console.log(c('Content validation script not found, skipping', 'yellow'));
    return true;
  }
  return run('npx tsx scripts/ai-validate.ts');
}

async function runVersionCheck(): Promise<boolean> {
  return run('npm run verify');
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();
  
  header('Pre-Push Validation');
  
  console.log(`Mode: ${isFast ? c('FAST', 'yellow') : c('FULL', 'green')}`);
  console.log(`Auto-fix: ${shouldFix ? c('YES', 'green') : c('NO', 'gray')}`);
  console.log(`Docker: ${isDocker ? c('YES', 'cyan') : c('NO', 'gray')}`);
  
  const stages = [
    { name: 'Git Status Check', fn: checkGitStatus, skip: false },
    { name: 'Package Versions', fn: runVersionCheck, skip: false },
    { name: 'Lint', fn: runLint, skip: false },
    { name: 'Type Check', fn: runTypeCheck, skip: false },
    { name: 'Content Validation', fn: runContentValidation, skip: false },
    { name: 'Unit Tests', fn: runUnitTests, skip: false },
    { name: 'Build', fn: runBuild, skip: false },
    { name: 'E2E Tests', fn: runE2ETests, skip: isFast },
    { name: 'Visual Tests', fn: runVisualTests, skip: isFast },
  ];
  
  let allPassed = true;
  let stageNum = 1;
  const totalStages = stages.filter(s => !s.skip).length;
  
  for (const { name, fn, skip } of stages) {
    if (!skip) {
      stageHeader(stageNum++, totalStages, name);
    }
    
    const passed = await stage(name, fn, skip);
    
    if (!passed && !skip) {
      allPassed = false;
      // Continue running other stages to collect all failures
      if (!isVerbose) {
        console.log(c(`Run with --verbose for details`, 'gray'));
      }
    }
  }
  
  // Summary
  const duration = Date.now() - startTime;
  header('Summary');
  
  console.log(`\n${c('Results:', 'bold')}\n`);
  
  for (const result of results) {
    const icon = result.status === 'pass' ? c('✓', 'green') 
      : result.status === 'fail' ? c('✗', 'red')
      : c('○', 'yellow');
    const time = result.duration > 0 ? c(`${(result.duration/1000).toFixed(1)}s`, 'gray') : '';
    console.log(`  ${icon} ${result.name.padEnd(25)} ${time}`);
  }
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  console.log(`\n${c('─'.repeat(50), 'gray')}`);
  console.log(`Total: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log(`Duration: ${(duration / 1000).toFixed(1)}s`);
  
  if (allPassed) {
    console.log(`\n${c('✅ All checks passed! Safe to push.', 'green')}\n`);
    process.exit(0);
  } else {
    console.log(`\n${c('❌ Some checks failed. Fix issues before pushing.', 'red')}\n`);
    
    // Suggest commands
    const failedStages = results.filter(r => r.status === 'fail').map(r => r.name);
    console.log(c('To debug:', 'yellow'));
    
    if (failedStages.includes('Lint')) {
      console.log(`  npm run lint:fix     # Auto-fix lint issues`);
    }
    if (failedStages.includes('Type Check')) {
      console.log(`  npm run type-check   # See type errors`);
    }
    if (failedStages.includes('Unit Tests')) {
      console.log(`  npm run test:ui      # Interactive test runner`);
    }
    if (failedStages.includes('E2E Tests')) {
      console.log(`  npm run test:e2e:ui  # Interactive Playwright`);
    }
    
    console.log('');
    process.exit(1);
  }
}

main().catch(error => {
  console.error(c(`Fatal error: ${error.message}`, 'red'));
  process.exit(1);
});
