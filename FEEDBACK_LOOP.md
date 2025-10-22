# AI-Powered Development Feedback Loop

## Overview

The MicroHAMS project now includes a complete modern development feedback loop with AI-assisted validation, visual regression testing, and automated CI/CD.

## 🎯 Key Features

### 1. **Error Boundary with Vite HMR Integration**
- Real-time error reporting from browser to dev server
- Source map integration for precise error location
- Visual error overlay in development
- WebSocket connection to Vite HMR

### 2. **Testing Infrastructure**
- **Vitest**: Fast unit testing with coverage
- **Playwright**: E2E and visual regression tests
- **Chromium**: Pre-installed for consistent testing
- **Watch Mode**: Auto-run tests on file changes

### 3. **Docker CI Pipeline**
- Ubuntu 22.04 base (matches GitHub Actions)
- Node.js 20 + pnpm
- Playwright with Chromium pre-installed
- Hot-reload capable for rapid iteration
- Docker Compose orchestration

### 4. **AI-Assisted Validation**
- Design system consistency checks
- Accessibility audits
- Performance monitoring
- Code quality analysis

### 5. **Automated Feedback Loop**
- File watching with chokidar
- Debounced type checking
- Automatic test execution
- Real-time validation

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

This installs:
- Vitest 3.2.4 + testing utilities
- Playwright 1.56.1 + Chromium
- ESLint 9.38.0 + TypeScript support
- Prettier 3.6.2 + Astro plugin
- Husky for git hooks

### Run Development with Feedback Loop

```bash
# Terminal 1: Dev server with HMR
npm run dev

# Terminal 2: Watch mode with auto-testing
node scripts/watch-feedback.js
```

### Run Tests

```bash
# Unit tests (watch mode)
npm run test

# Unit tests (run once)
npm run test:unit

# Unit tests (with UI)
npm run test:ui

# E2E tests
npm run test:e2e

# E2E tests (UI mode)
npm run test:e2e:ui

# E2E tests (debug mode)
npm run test:e2e:debug

# Visual regression tests only
npm run test:visual

# All tests
npm run test:all
```

### Run AI Validation

```bash
# Manual validation
node scripts/ai-validate.js

# Automatic validation runs on file changes with watch mode
```

### Run Linting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

### Full CI Pipeline

```bash
npm run ci
```

This runs: lint → type-check → test:all → build

## 🐳 Docker CI Pipeline

### Build Container

```bash
npm run docker:build
```

### Run CI in Container

```bash
npm run docker:test
```

### Docker Compose Orchestration

```bash
# Start all services
docker-compose -f .docker/docker-compose.yml up

# Run CI only
docker-compose -f .docker/docker-compose.yml run ci

# Run E2E tests
docker-compose -f .docker/docker-compose.yml up dev e2e

# Watch mode for unit tests
docker-compose -f .docker/docker-compose.yml up unit-watch
```

## 📊 Error Boundary System

### How It Works

1. **Initialization**: Error boundary loads automatically in development
2. **Error Capture**: Catches:
   - Unhandled errors
   - Promise rejections
   - Console errors
3. **Reporting**: Sends errors to Vite dev server over WebSocket
4. **Display**: Shows detailed overlay with:
   - Error message
   - Stack trace
   - Source location
   - Context information

### Access Error Boundary

In development, access via browser console:

```javascript
// View all captured errors
window.__errorBoundary.getErrors()

// Clear errors
window.__errorBoundary.clearErrors()
```

### Trigger Test Error

```javascript
// In browser console
throw new Error('Test error from error boundary');
```

## 🧪 Writing Tests

### Unit Test Example

```typescript
// src/utils/example.test.ts
import { describe, it, expect } from 'vitest';

describe('Example', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

### E2E Test Example

```typescript
// playwright/example.spec.ts
import { test, expect } from '@playwright/test';

test('navigates to articles', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Articles');
  await expect(page).toHaveURL(/\/articles/);
});
```

### Visual Regression Test

```typescript
// playwright/example.visual.spec.ts
import { test, expect } from '@playwright/test';

test('homepage visual @visual', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

## 🎨 AI Validation Categories

### Design System
- Magic number detection (hardcoded pixels)
- Color token usage
- Typography scale compliance
- Spacing system adherence

### Accessibility
- Missing alt text
- Icon buttons without aria-label
- Color contrast ratios
- Keyboard navigation
- Focus management

### Performance
- CSS bundle size (<50KB target)
- Image optimization
- Font loading strategy
- Critical CSS extraction

### Code Quality
- TypeScript type checking
- ESLint violations
- Prettier formatting
- Import organization

## 📁 Test Structure

```
microhams/
├── playwright/              # E2E & visual tests
│   ├── homepage.spec.ts
│   ├── visual.spec.ts
│   └── mobile.spec.ts
├── src/
│   ├── test/
│   │   └── setup.ts        # Vitest setup
│   └── **/*.test.ts        # Unit tests
├── test-results/           # Test output
│   ├── vitest/
│   ├── playwright/
│   └── playwright-artifacts/
└── scripts/
    ├── ai-validate.js      # AI validation
    └── watch-feedback.js   # Feedback loop
```

## 🔄 Feedback Loop Workflow

```
┌─────────────────┐
│   File Change   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Detect  │
    │  Type   │
    └────┬────┘
         │
    ┌────▼────┐
    │   Run   │
    │ Action  │
    └────┬────┘
         │
    ┌────▼────┐
    │ Report  │
    │ Results │
    └─────────┘
```

### File Type Actions

- **CSS**: Design system validation
- **TypeScript/Astro**: Type checking
- **Test files**: Run related tests
- **Components**: Accessibility checks

## 🚀 CI/CD Pipeline

### GitHub Actions (Existing)

```yaml
# .github/workflows/deploy.yml
on: push to main
  → Install deps
  → Build
  → Deploy to Pages
```

### Local Docker CI (New)

```bash
# Matches GitHub Actions environment
docker run → npm run ci
  → Lint
  → Type check
  → Test (unit + E2E)
  → Build
```

## 🎯 Best Practices

### Before Committing

```bash
# Run full CI locally
npm run ci

# Or use Docker for exact match
npm run docker:test
```

### During Development

```bash
# Keep these running:
npm run dev              # Terminal 1
node scripts/watch-feedback.js  # Terminal 2
```

### Visual Testing

```bash
# Generate baseline screenshots
npm run test:visual

# Update snapshots after intentional changes
npm run test:visual -- --update-snapshots
```

### Debugging

```bash
# Debug E2E tests
npm run test:e2e:debug

# View test results
open test-results/playwright/index.html
```

## 📊 Coverage Reports

### Unit Test Coverage

```bash
npm run test:unit -- --coverage
open coverage/index.html
```

### E2E Test Reports

```bash
npm run test:e2e
open test-results/playwright/index.html
```

## 🔧 Configuration Files

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Prettier formatting
- `.docker/Dockerfile` - CI container
- `.docker/docker-compose.yml` - Orchestration

## 🐛 Troubleshooting

### Tests Failing in Docker

```bash
# Rebuild container
docker-compose -f .docker/docker-compose.yml build --no-cache

# Check logs
docker-compose -f .docker/docker-compose.yml logs
```

### Visual Tests Failing

```bash
# Fonts might not match - regenerate baselines
npm run test:visual -- --update-snapshots
```

### Error Boundary Not Working

1. Check dev server is running
2. Verify WebSocket connection in browser console
3. Check for Content Security Policy issues

### Watch Mode Not Triggering

```bash
# Increase file watch limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Vite HMR API](https://vitejs.dev/guide/api-hmr.html)

## 🎓 Learning Path

1. **Start with Unit Tests**: `src/**/*.test.ts`
2. **Add E2E Tests**: `playwright/*.spec.ts`
3. **Visual Testing**: `playwright/*.visual.spec.ts`
4. **Run AI Validation**: `node scripts/ai-validate.js`
5. **Use Docker CI**: `npm run docker:test`

---

**October 2025 Compatible** ✅  
All packages verified against npm registry as of October 21, 2025:
- **Astro**: 5.14.8
- **Vite**: 7.1.11  
- **Vitest**: 3.2.4
- **Playwright**: 1.56.1
- **ESLint**: 9.38.0
- **TypeScript**: 5.9.3
- **Prettier**: 3.6.2

See [VERSION_AUDIT.md](./VERSION_AUDIT.md) for complete version details and migration notes.
