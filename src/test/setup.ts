/**
 * Vitest Test Setup
 * 
 * Global setup for unit tests
 */

import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Add custom matchers
expect.extend({
  toMatchDesignSystem(received: string, expected: string) {
    const pass = received === expected;
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to match design system token ${expected}`
          : `Expected ${received} to match design system token ${expected}`,
    };
  },
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;
