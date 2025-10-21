#!/usr/bin/env node

/**
 * AI Development Assistant
 * 
 * Provides AI-powered feedback for design system validation,
 * accessibility checks, and code quality
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ValidationResult {
  category: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

class AIDevAssistant {
  private results: ValidationResult[] = [];

  /**
   * Main validation entry point
   */
  async validate(): Promise<void> {
    console.log('🤖 AI Development Assistant - Running Validations...\n');

    await this.validateDesignSystem();
    await this.validateAccessibility();
    await this.validatePerformance();
    await this.validateCodeQuality();

    this.printResults();
  }

  /**
   * Validate design system consistency
   */
  private async validateDesignSystem(): Promise<void> {
    console.log('📐 Validating Design System...');

    // Check for magic numbers in CSS
    const cssFiles = this.findFiles('src/styles', ['.css']);
    
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for hardcoded pixel values (magic numbers)
      const pixelMatches = content.match(/:\s*\d+px/g);
      if (pixelMatches && !file.includes('_tokens.css')) {
        this.results.push({
          category: 'Design System',
          status: 'warning',
          message: `Found ${pixelMatches.length} hardcoded pixel values in ${path.basename(file)}`,
          suggestion: 'Use design tokens from 00-settings/_tokens.css instead of magic numbers',
        });
      }

      // Check for color values not using design tokens
      const colorMatches = content.match(/(#[0-9a-fA-F]{3,6}|rgb\(|hsl\()/g);
      if (colorMatches && !file.includes('_tokens.css')) {
        this.results.push({
          category: 'Design System',
          status: 'warning',
          message: `Found ${colorMatches.length} hardcoded colors in ${path.basename(file)}`,
          suggestion: 'Use OKLCH color tokens: var(--color-*)',
        });
      }
    }

    this.results.push({
      category: 'Design System',
      status: 'pass',
      message: 'Design system validation complete',
    });
  }

  /**
   * Validate accessibility
   */
  private async validateAccessibility(): Promise<void> {
    console.log('♿ Validating Accessibility...');

    // Check for images without alt text
    const astroFiles = this.findFiles('src', ['.astro', '.md']);
    
    for (const file of astroFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for img tags without alt
      const imgWithoutAlt = content.match(/<img(?![^>]*alt=)/g);
      if (imgWithoutAlt) {
        this.results.push({
          category: 'Accessibility',
          status: 'error',
          message: `Found ${imgWithoutAlt.length} <img> tags without alt attribute in ${path.basename(file)}`,
          suggestion: 'Add alt="" for decorative images or descriptive alt text',
        });
      }

      // Check for buttons without aria-label when icon-only
      const iconButtons = content.match(/<button[^>]*>[^<]*<svg/g);
      if (iconButtons) {
        for (const btn of iconButtons) {
          if (!btn.includes('aria-label')) {
            this.results.push({
              category: 'Accessibility',
              status: 'error',
              message: `Found icon button without aria-label in ${path.basename(file)}`,
              suggestion: 'Add aria-label to icon-only buttons',
            });
            break; // Report once per file
          }
        }
      }
    }

    this.results.push({
      category: 'Accessibility',
      status: 'pass',
      message: 'Accessibility checks complete',
    });
  }

  /**
   * Validate performance
   */
  private async validatePerformance(): Promise<void> {
    console.log('⚡ Validating Performance...');

    // Check CSS bundle size
    const cssFiles = this.findFiles('src/styles', ['.css']);
    let totalSize = 0;

    for (const file of cssFiles) {
      const stats = fs.statSync(file);
      totalSize += stats.size;
    }

    const sizeKB = Math.round(totalSize / 1024);
    
    if (sizeKB > 50) {
      this.results.push({
        category: 'Performance',
        status: 'warning',
        message: `CSS bundle size is ${sizeKB}KB (target: <50KB)`,
        suggestion: 'Consider removing unused styles or splitting CSS',
      });
    } else {
      this.results.push({
        category: 'Performance',
        status: 'pass',
        message: `CSS bundle size: ${sizeKB}KB ✓`,
      });
    }

    // Check for large images
    const publicFiles = this.findFiles('public', ['.jpg', '.jpeg', '.png', '.webp']);
    
    for (const file of publicFiles) {
      const stats = fs.statSync(file);
      const sizeMB = stats.size / (1024 * 1024);
      
      if (sizeMB > 0.5) {
        this.results.push({
          category: 'Performance',
          status: 'warning',
          message: `Large image: ${path.basename(file)} (${sizeMB.toFixed(2)}MB)`,
          suggestion: 'Compress images or convert to WebP format',
        });
      }
    }
  }

  /**
   * Validate code quality
   */
  private async validateCodeQuality(): Promise<void> {
    console.log('🔍 Validating Code Quality...');

    try {
      // Run TypeScript check
      await execAsync('npx astro check');
      this.results.push({
        category: 'Code Quality',
        status: 'pass',
        message: 'TypeScript type checking passed ✓',
      });
    } catch (error: any) {
      this.results.push({
        category: 'Code Quality',
        status: 'error',
        message: 'TypeScript type checking failed',
        suggestion: 'Run `npm run type-check` for details',
      });
    }
  }

  /**
   * Find files by extension
   */
  private findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findFiles(fullPath, extensions));
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Print validation results
   */
  private printResults(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 Validation Results');
    console.log('='.repeat(80) + '\n');

    const grouped = this.results.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    }, {} as Record<string, ValidationResult[]>);

    for (const [category, results] of Object.entries(grouped)) {
      console.log(`\n${category}:`);
      console.log('-'.repeat(40));

      for (const result of results) {
        const icon =
          result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
        console.log(`${icon} ${result.message}`);
        if (result.suggestion) {
          console.log(`   💡 ${result.suggestion}`);
        }
      }
    }

    const errors = this.results.filter((r) => r.status === 'error').length;
    const warnings = this.results.filter((r) => r.status === 'warning').length;
    const passes = this.results.filter((r) => r.status === 'pass').length;

    console.log('\n' + '='.repeat(80));
    console.log(`Summary: ${passes} passed, ${warnings} warnings, ${errors} errors`);
    console.log('='.repeat(80) + '\n');

    if (errors > 0) {
      console.log('❌ Validation failed with errors. Please fix the issues above.');
      process.exit(1);
    } else if (warnings > 0) {
      console.log('⚠️  Validation passed with warnings. Consider addressing them.');
    } else {
      console.log('✅ All validations passed!');
    }
  }
}

// Run validation
const assistant = new AIDevAssistant();
assistant.validate().catch((error) => {
  console.error('Error running validation:', error);
  process.exit(1);
});
