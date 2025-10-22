// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://microhams.net',
  // GitHub Pages config - uncomment if deploying to a subdirectory
  // base: '/repository-name',
  output: 'static',
  build: {
    assets: '_assets',
  },
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  // Vite configuration for enhanced dev experience
  vite: {
    // Development server configuration
    server: {
      // Enable HMR for error boundary communication
      hmr: {
        overlay: true,
        clientPort: undefined,
      },
      // Watch options for better feedback loop
      watch: {
        // Ignore test files from triggering rebuilds
        ignored: ['**/test-results/**', '**/playwright-report/**', '**/.docker/**'],
      },
    },
    // Build optimizations
    build: {
      // Generate source maps for debugging
      sourcemap: true,
      // Report compressed size
      reportCompressedSize: true,
      // CSS code splitting
      cssCodeSplit: true,
      // Rollup options for better tree-shaking
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            'design-system': ['./src/styles/main.css'],
          },
        },
      },
    },
    // CSS options
    css: {
      // Dev source maps for debugging
      devSourcemap: true,
    },
    // Plugins for enhanced development
    plugins: [],
    // Optimize dependencies
    optimizeDeps: {
      exclude: ['@astrojs/check'],
    },
  },
});
