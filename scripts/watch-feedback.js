#!/usr/bin/env node

/**
 * Development Feedback Loop Automation
 * 
 * Watches for changes and runs appropriate tests/validations
 * Provides real-time feedback for AI-assisted development
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import chokidar from 'chokidar';

class FeedbackLoop {
  constructor() {
    this.watchers = [];
    this.runningProcesses = new Map();
  }

  /**
   * Start the feedback loop
   */
  start() {
    console.log('🔄 Starting Development Feedback Loop...\n');

    // Watch CSS files for design system validation
    this.watchCSS();

    // Watch Astro/TS files for type checking
    this.watchCode();

    // Watch test files
    this.watchTests();

    console.log('\n✅ Feedback loop running. Press Ctrl+C to stop.\n');
  }

  /**
   * Watch CSS files
   */
  watchCSS() {
    const watcher = chokidar.watch('src/styles/**/*.css', {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    });

    watcher.on('change', (filePath) => {
      console.log(`\n📐 CSS changed: ${path.basename(filePath)}`);
      this.runValidation('design-system');
    });

    this.watchers.push(watcher);
    console.log('👁️  Watching CSS files for design system validation...');
  }

  /**
   * Watch code files
   */
  watchCode() {
    const watcher = chokidar.watch('src/**/*.{ts,astro}', {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    });

    watcher.on('change', (filePath) => {
      console.log(`\n🔍 Code changed: ${path.basename(filePath)}`);
      
      // Debounce type checking
      if (this.typeCheckTimeout) {
        clearTimeout(this.typeCheckTimeout);
      }
      
      this.typeCheckTimeout = setTimeout(() => {
        this.runCommand('type-check', 'npx', ['astro', 'check', '--minimumSeverity', 'warning']);
      }, 1000);
    });

    this.watchers.push(watcher);
    console.log('👁️  Watching code files for type checking...');
  }

  /**
   * Watch test files
   */
  watchTests() {
    const watcher = chokidar.watch('src/**/*.{test,spec}.ts', {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    });

    watcher.on('change', (filePath) => {
      console.log(`\n🧪 Test changed: ${path.basename(filePath)}`);
      
      // Run only the changed test file
      this.runCommand('unit-test', 'npm', ['run', 'test', '--', filePath]);
    });

    this.watchers.push(watcher);
    console.log('👁️  Watching test files...');
  }

  /**
   * Run validation
   */
  runValidation(type) {
    console.log(`\n🤖 Running ${type} validation...`);
    
    // Kill existing validation process
    if (this.runningProcesses.has(type)) {
      this.runningProcesses.get(type).kill();
    }

    const proc = spawn('node', ['scripts/ai-validate.js'], {
      stdio: 'inherit',
      shell: true,
    });

    this.runningProcesses.set(type, proc);

    proc.on('exit', (code) => {
      this.runningProcesses.delete(type);
      if (code === 0) {
        console.log(`✅ ${type} validation passed`);
      } else {
        console.log(`❌ ${type} validation failed`);
      }
    });
  }

  /**
   * Run command
   */
  runCommand(id, command, args) {
    // Kill existing process
    if (this.runningProcesses.has(id)) {
      this.runningProcesses.get(id).kill();
    }

    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    this.runningProcesses.set(id, proc);

    proc.on('exit', (code) => {
      this.runningProcesses.delete(id);
      if (code === 0) {
        console.log(`✅ ${id} passed`);
      } else {
        console.log(`❌ ${id} failed`);
      }
    });
  }

  /**
   * Stop the feedback loop
   */
  stop() {
    console.log('\n🛑 Stopping feedback loop...');

    // Close all watchers
    for (const watcher of this.watchers) {
      watcher.close();
    }

    // Kill all running processes
    for (const [id, proc] of this.runningProcesses) {
      proc.kill();
    }

    console.log('✅ Feedback loop stopped');
  }
}

// Start feedback loop
const loop = new FeedbackLoop();
loop.start();

// Graceful shutdown
process.on('SIGINT', () => {
  loop.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  loop.stop();
  process.exit(0);
});
