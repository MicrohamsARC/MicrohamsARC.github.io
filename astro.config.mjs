// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';

// https://astro.build/config
export default defineConfig({
  site: 'https://microhams.com',
  // GitHub Pages config - uncomment if deploying to a subdirectory
  // base: '/repository-name',
  output: 'static',
  // Prefetch internal navigation targets before the click so full-page loads
  // feel instant and there's no blank inter-page gap. Works without a client
  // router: it just warms the HTML into the browser cache. `hover` keeps
  // bandwidth modest; nav links opt into eager `viewport` prefetch individually.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  build: {
    assets: '_assets',
    // Cache busting via content hashing
    inlineStylesheets: 'auto',
  },
  // Self-hosted fonts via Astro's native Fonts API (local provider — no
  // build-time network). This preloads the woff2 and, because each fallback
  // stack ends in a generic keyword, generates a metric-matched fallback face
  // (size-adjust/ascent-override) so text does not visibly swap or reflow on
  // load — eliminating the FOUT flicker on every navigation. Font files live in
  // src/assets/fonts (latin subset, variable). The `--font-*` CSS variables are
  // consumed in src/styles/01-typography/_fonts.css.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--font-atkinson',
      fallbacks: ['ui-sans-serif', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '200 800',
            style: 'normal',
            src: ['./src/assets/fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2'],
          },
          {
            weight: '200 800',
            style: 'italic',
            src: ['./src/assets/fonts/atkinson-hyperlegible-next-latin-wght-italic.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            weight: '100 800',
            style: 'normal',
            src: ['./src/assets/fonts/jetbrains-mono-latin-wght-normal.woff2'],
          },
        ],
      },
    },
  ],
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
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
          // NOTE: no manual CSS chunk. Forcing main.css into its own chunk kept
          // `inlineStylesheets: 'auto'` from ever inlining the critical CSS,
          // adding a render-blocking round-trip on every cold page load. Letting
          // Astro decide lets small critical CSS inline for faster first paint.
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
