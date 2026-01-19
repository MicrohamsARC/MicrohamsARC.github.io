// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://microhams.com',
  // GitHub Pages config - uncomment if deploying to a subdirectory
  // base: '/repository-name',
  output: 'static',
  build: {
    assets: '_assets',
    // Cache busting via content hashing
    inlineStylesheets: 'auto',
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
      // Disable sourcemaps in production to avoid astro:transitions warning
      // Dev still has sourcemaps via devSourcemap below
      sourcemap: false,
      // Report compressed size
      reportCompressedSize: true,
      // CSS code splitting
      cssCodeSplit: true,
      // Rollup options for better tree-shaking and cache busting
      rollupOptions: {
        output: {
          // Cache busting with content hashes
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/chunk.[hash].js',
          assetFileNames: 'assets/asset.[hash][extname]',
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
