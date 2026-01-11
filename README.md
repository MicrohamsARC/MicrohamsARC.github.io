# MicroHAMS - Modern Amateur Radio Resource Hub

A modern, design-system-driven static site built with Astro, featuring a complete AI-powered development feedback loop.

## 🎯 Project Philosophy

Built following **Vignelli's design principles**:
- **Semantic approach** - Content separated from presentation
- **Discipline** - Consistent design system with 140+ tokens
- **Timelessness** - ITCSS architecture for maintainable CSS
- **Responsibility** - Accessibility-first, performance-focused

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Run tests
npm run test

# Full CI pipeline
npm run ci
```

## � Project Structure

```
microhams/
├── content/              # 📝 Content Collections (markdown)
│   ├── articles/         # Blog posts and technical guides
│   ├── docs/             # Reference documentation
│   ├── projects/         # Project documentation
│   ├── pages/            # General site pages
│   └── config.ts         # Content schemas (TypeScript)
├── src/
│   ├── layouts/          # Astro layouts
│   ├── pages/            # Route files (index, [slug])
│   ├── lib/              # Error boundary, utilities
│   ├── styles/           # ITCSS CSS architecture
│   └── test/             # Vitest setup
├── playwright/           # E2E and visual regression tests
├── scripts/              # AI validation, watch feedback
├── .docker/              # CI container (Ubuntu 22.04)
├── docs/                 # Project documentation
└── public/               # Static assets

```

### Key Design Decisions

**Content at Root Level**: The `content/` directory is at the project root (not in `src/`) to clearly separate:
- **Content** (markdown, schemas) - Managed by writers/editors
- **Code** (components, logic) - Managed by developers

Astro automatically discovers content via a symlink at `src/content → ../content`. This approach enables:
- Easier content contribution (no need to navigate src/)
- Potential for content as separate git submodule
- Clear separation between content and code

See [CONTENT_REORGANIZATION.md](docs/CONTENT_REORGANIZATION.md) for details.

## 🎨 Design System

### CSS Architecture (ITCSS)

```
src/styles/
├── 00-settings/      # Design tokens (colors, spacing, typography)
├── 01-tools/         # Custom properties setup
├── 02-generic/       # CSS resets
├── 03-elements/      # Base HTML elements
├── 04-layouts/       # Layout primitives (Stack, Cluster, Grid, etc.)
├── 05-components/    # UI components (Card, Button, Badge, etc.)
└── 06-utilities/     # Utility classes
```

### Core Principles

- **OKLCH color space** for perceptual uniformity
- **Perfect Fourth typographic scale** (1.333 ratio)
- **Powers-of-2 spacing** (4px base unit)
- **Logical properties** for i18n
- **Data attributes** for state (HMR-friendly)

## 🧪 Testing Infrastructure

### Unit Tests (Vitest 3.2.4)
```bash
npm run test          # Watch mode
npm run test:unit     # Run once
npm run test:ui       # Visual UI
```

### E2E Tests (Playwright 1.56.1)
```bash
npm run test:e2e      # Run E2E tests
npm run test:visual   # Visual regression only
npm run test:e2e:ui   # Interactive UI mode
```

### Full CI Pipeline
```bash
npm run ci            # lint → type-check → test → build
```

## 🐳 Docker CI

Local CI that mirrors GitHub Actions:

```bash
# Build container
npm run docker:build

# Run full CI in Docker
npm run docker:test

# Or use docker-compose
docker-compose -f .docker/docker-compose.yml up ci
```

## 📝 Adding Content

### New Article

```bash
cat > content/articles/my-article.md << 'EOF'
---
title: "My Article Title"
description: "Brief description"
author: "Your Name"
date: 2025-10-21
tags: ["ham-radio", "tutorial"]
featured: true
---

Your content here...
EOF
```

### New Documentation Page

```bash
cat > content/docs/my-doc.md << 'EOF'
---
title: "Documentation Title"
description: "What this documents"
order: 10
section: "Getting Started"
---

Documentation content...
EOF
```

### New Project

```bash
cat > content/projects/my-project.md << 'EOF'
---
title: "Project Name"
description: "What it does"
status: "active"
technologies: ["Python", "Raspberry Pi"]
repository: "https://github.com/..."
---

Project details...
EOF
```

## 🤖 AI-Powered Development

### AI Validation

```bash
# Manual validation
node scripts/ai-validate.js

# Validates:
# - Design system consistency (no magic numbers)
# - Accessibility (alt text, ARIA labels)
# - Performance (bundle size)
# - Code quality (type checking)
```

### Automated Feedback Loop

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Watch mode with auto-validation
node scripts/watch-feedback.js
```

### Verify Versions

```bash
# Check all packages are at October 2025 versions
npm run verify
```

## 🔧 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:4321) |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:visual` | Visual regression tests only |
| `npm run lint` | Check ESLint errors |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | TypeScript type checking |
| `npm run verify` | Verify package versions |
| `npm run ci` | Full CI pipeline |
| `npm run docker:build` | Build Docker CI image |
| `npm run docker:test` | Run CI in Docker |

## 📊 Error Boundary

Development includes a sophisticated error boundary that:
- Catches runtime errors in browser
- Reports to Vite dev server over WebSocket
- Shows detailed overlay with source maps
- Includes component stack traces

Access via browser console:
```javascript
window.__errorBoundary.getErrors()    // View captured errors
window.__errorBoundary.clearErrors()  // Clear error log
```

## 📚 Documentation

- **[START_HERE.md](docs/START_HERE.md)** - Getting started guide
- **[PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Architecture overview
- **[FEEDBACK_LOOP.md](FEEDBACK_LOOP.md)** - AI-powered development workflow
- **[VERSION_AUDIT.md](VERSION_AUDIT.md)** - Package versions (October 2025)
- **[CONTRIBUTING.md](content/CONTRIBUTING.md)** - Content contribution guide

## 🌐 Deployment

### GitHub Pages (Automatic)

Push to `main` branch triggers GitHub Actions:
```yaml
Build → Deploy to gh-pages
```

Site available at: `https://microhams.com`

### Manual Deploy

```bash
npm run build
# Upload dist/ to your hosting provider
```

## 🎓 Technology Stack

**October 2025 Compatible** ✅

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | 5.14.8 | Static site generator |
| **Vite** | 7.1.11 | Build tool & HMR |
| **Vitest** | 3.2.4 | Unit testing |
| **Playwright** | 1.56.1 | E2E & visual testing |
| **TypeScript** | 5.9.3 | Type safety |
| **ESLint** | 9.38.0 | Code linting |
| **Prettier** | 3.6.2 | Code formatting |
| **Docker** | Ubuntu 22.04 + Node 20 | Local CI |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add content or fix bugs
4. Run full CI: `npm run ci`
5. Submit pull request

See [CONTRIBUTING.md](content/CONTRIBUTING.md) for detailed guidelines.

## 📄 License

[Specify your license here]

## 🔗 Links

- [Project Documentation](docs/)
- [Design System Guide](docs/PROJECT_SUMMARY.md)
- [Astro Documentation](https://docs.astro.build)
- [Playwright Docs](https://playwright.dev)
- [Vitest Docs](https://vitest.dev)

---

**Built with** ❤️ **using Vignelli's design principles**  
_Last updated: October 21, 2025_

