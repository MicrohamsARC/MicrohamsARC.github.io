/**
 * Error Boundary Component
 * 
 * Catches runtime errors and reports them to Vite dev server
 * Provides detailed error information with source maps
 */

/// <reference types="astro/client" />

interface ErrorBoundaryProps {
  fallback?: (error: Error, errorInfo: ErrorInfo) => any;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorInfo {
  componentStack: string;
  timestamp: number;
  userAgent: string;
  location: string;
}

class ErrorBoundary {
  private static instance: ErrorBoundary;
  private errors: Array<{ error: Error; info: ErrorInfo }> = [];
  private wsConnection: WebSocket | null = null;
  
  private constructor() {
    this.setupGlobalErrorHandlers();
    this.connectToViteHMR();
  }
  
  static getInstance(): ErrorBoundary {
    if (!ErrorBoundary.instance) {
      ErrorBoundary.instance = new ErrorBoundary();
    }
    return ErrorBoundary.instance;
  }
  
  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        componentStack: event.filename || 'unknown',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        location: window.location.href,
      });
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        componentStack: 'Promise rejection',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        location: window.location.href,
      });
    });
    
    // Handle console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const error = new Error(args.join(' '));
      this.handleError(error, {
        componentStack: 'Console error',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        location: window.location.href,
      });
      originalConsoleError.apply(console, args);
    };
  }
  
  /**
   * Connect to Vite HMR WebSocket for error reporting
   */
  private connectToViteHMR(): void {
    if (import.meta.env.DEV && import.meta.hot) {
      // Get Vite's WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}`;
      
      try {
        this.wsConnection = new WebSocket(wsUrl, 'vite-hmr');
        
        this.wsConnection.addEventListener('open', () => {
          console.log('[ErrorBoundary] Connected to Vite HMR');
        });
        
        this.wsConnection.addEventListener('error', (error) => {
          console.warn('[ErrorBoundary] WebSocket error:', error);
        });
        
        this.wsConnection.addEventListener('close', () => {
          console.log('[ErrorBoundary] Disconnected from Vite HMR');
          // Attempt to reconnect after 1 second
          setTimeout(() => this.connectToViteHMR(), 1000);
        });
      } catch (error) {
        console.warn('[ErrorBoundary] Failed to connect to Vite HMR:', error);
      }
    }
  }
  
  /**
   * Handle an error
   */
  private handleError(error: Error, info: ErrorInfo): void {
    // Store error
    this.errors.push({ error, info });
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.info('Info:', info);
      console.groupEnd();
    }
    
    // Send to Vite dev server
    this.reportToVite(error, info);
    
    // Display error overlay in development
    if (import.meta.env.DEV) {
      this.showErrorOverlay(error, info);
    }
  }
  
  /**
   * Report error to Vite dev server
   */
  private reportToVite(error: Error, info: ErrorInfo): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      try {
        this.wsConnection.send(JSON.stringify({
          type: 'custom',
          event: 'error-boundary',
          data: {
            message: error.message,
            stack: error.stack,
            info,
            // Include source location if available
            source: this.extractSourceLocation(error),
          },
        }));
      } catch (err) {
        console.warn('[ErrorBoundary] Failed to send error to Vite:', err);
      }
    }
  }
  
  /**
   * Extract source location from error stack
   */
  private extractSourceLocation(error: Error): { file: string; line: number; column: number } | null {
    if (!error.stack) return null;
    
    // Parse stack trace
    const stackLines = error.stack.split('\n');
    const relevantLine = stackLines.find(line => 
      line.includes('.ts') || line.includes('.js') || line.includes('.astro')
    );
    
    if (!relevantLine) return null;
    
    // Extract file, line, and column
    const match = relevantLine.match(/\((.+):(\d+):(\d+)\)/);
    if (match) {
      return {
        file: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
      };
    }
    
    return null;
  }
  
  /**
   * Show error overlay in development
   */
  private showErrorOverlay(error: Error, info: ErrorInfo): void {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'error-boundary-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 2rem;
      overflow: auto;
      z-index: 999999;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.5;
    `;
    
    // Create content
    const content = `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h1 style="color: #ff5555; margin: 0;">🚨 Runtime Error</h1>
          <button onclick="document.getElementById('error-boundary-overlay').remove()" 
                  style="background: #333; color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">
            Close (Esc)
          </button>
        </div>
        
        <div style="background: #1e1e1e; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <h2 style="color: #ff5555; margin-top: 0;">Error Message</h2>
          <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${this.escapeHtml(error.message)}</pre>
        </div>
        
        ${error.stack ? `
          <div style="background: #1e1e1e; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h2 style="color: #50fa7b; margin-top: 0;">Stack Trace</h2>
            <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word; font-size: 12px;">${this.escapeHtml(error.stack)}</pre>
          </div>
        ` : ''}
        
        <div style="background: #1e1e1e; padding: 1.5rem; border-radius: 8px;">
          <h2 style="color: #8be9fd; margin-top: 0;">Context</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid #333;">Component:</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #333;">${this.escapeHtml(info.componentStack)}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid #333;">Location:</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #333;">${this.escapeHtml(info.location)}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid #333;">Timestamp:</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #333;">${new Date(info.timestamp).toISOString()}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem;">User Agent:</td>
              <td style="padding: 0.5rem; font-size: 11px;">${this.escapeHtml(info.userAgent)}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: #282a36; border-radius: 4px; border-left: 4px solid #f1fa8c;">
          <strong>💡 Tip:</strong> This error has been reported to the Vite dev server. 
          Check your terminal for more details.
        </div>
      </div>
    `;
    
    overlay.innerHTML = content;
    
    // Remove existing overlay if present
    const existing = document.getElementById('error-boundary-overlay');
    if (existing) {
      existing.remove();
    }
    
    // Add to document
    document.body.appendChild(overlay);
    
    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
  
  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Get all captured errors
   */
  getErrors(): Array<{ error: Error; info: ErrorInfo }> {
    return [...this.errors];
  }
  
  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }
}

// Initialize error boundary in browser
if (typeof window !== 'undefined') {
  ErrorBoundary.getInstance();
}

export default ErrorBoundary;
