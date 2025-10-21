/**
 * Error Boundary Client Script
 * 
 * Automatically loaded in development to catch and report errors
 */

import ErrorBoundary from './error-boundary';

// Initialize error boundary
const errorBoundary = ErrorBoundary.getInstance();

// Add HMR support
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('[HMR] Error boundary reloaded');
  });
  
  // Custom HMR event handler for error reports
  import.meta.hot.on('error-boundary:clear', () => {
    errorBoundary.clearErrors();
    console.log('[ErrorBoundary] Errors cleared');
  });
}

// Expose to window for debugging
if (import.meta.env.DEV) {
  (window as any).__errorBoundary = errorBoundary;
  console.log('[ErrorBoundary] Initialized. Access via window.__errorBoundary');
}

export default errorBoundary;
