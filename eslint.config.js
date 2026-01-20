import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  // Ignore patterns first
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      '**/*.d.ts',
    ],
  },

  // Base config for all files
  eslint.configs.recommended,

  // TypeScript and JavaScript files
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // TypeScript specific
      'no-unused-vars': 'off', // Use TypeScript rule instead
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^ErrorBoundaryProps$',
          caughtErrorsIgnorePattern: '^_|^error$',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // General
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-useless-escape': 'warn',

      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
    },
  },

  // Astro files
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Node scripts
  {
    files: ['scripts/**/*.{js,ts}', '*.config.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // Allow console in scripts
      'no-unused-vars': 'off', // Use TypeScript rule instead
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^fs$|^readFileSync$|^id$',
          caughtErrorsIgnorePattern: '^_|^error$',
        },
      ],
    },
  },

  // Test files
  {
    files: [
      '**/*.{test,spec}.{js,ts}',
      '**/playwright/**/*.ts',
      'src/test/**/*.ts',
      'vitest.config.ts',
      'playwright.config.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off', // Playwright/Vitest provide global types
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_|^error',
        },
      ],
    },
  },

  // Client-side scripts (browser only)
  {
    files: ['src/lib/error-boundary*.ts', 'src/components/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'off', // Allow console in error boundary
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
