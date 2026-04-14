# Development Setup

Local setup and development reference for the [MicroHAMS website](https://microhams.com).

## Prerequisites

- **Node.js** >= 22 (check with `node -v`)
- **npm** >= 10

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321` with hot module replacement.

## Project Structure

```text
src/
├── content/          # Markdown content collections
│   ├── articles/     # Technical articles and guides
│   ├── docs/         # Reference documentation
│   ├── events/       # Club events and meetings
│   ├── pages/        # Static pages (about, dues)
│   └── config.ts     # Zod content schemas
├── components/       # Astro components
├── layouts/          # Page layouts
├── pages/            # Route files
├── styles/           # CSS (ITCSS architecture)
├── utils/            # Shared utilities
└── site.config.ts    # Venues, meeting links, site-wide settings
playwright/           # E2E tests
scripts/              # Build and validation scripts
public/               # Static assets (copied as-is to dist/)
.docker/              # Docker configuration
```

## Scripts

### Development

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Dev server with HMR              |
| `npm run build`   | Build static site to `dist/`     |
| `npm run preview` | Preview production build locally |

### Testing

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm test`         | Unit tests in watch mode (Vitest) |
| `npm run test:run` | Unit tests, single run            |

**E2E Tests (optional):**

Playwright is not installed by default. The test commands will prompt for setup if needed.

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run test:e2e`        | E2E tests (auto-installs browsers if needed) |
| `npm run test:e2e:ui`     | E2E tests with interactive UI                |
| `npm run test:e2e:update` | Update E2E snapshots                         |

### Code Quality

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run lint`       | Check for lint errors         |
| `npm run lint:fix`   | Auto-fix lint errors          |
| `npm run type-check` | TypeScript + Astro validation |

### Validation

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `npm run verify`   | Check package versions + security audit           |
| `npm run validate` | Design system + accessibility checks              |
| `npm run ci`       | Local validation (lint, types, unit tests, build) |

## Git Hooks

Pre-configured via Husky, run automatically on git operations:

- **pre-commit**: lint-staged (ESLint + Prettier) + `astro check`
- **pre-push**: full validation suite (lint, type-check, unit tests, build)

## Docker

Docker provides a consistent environment matching CI, useful when Playwright browser installation is unreliable or you want to reproduce CI failures exactly.

| Command                | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `npm run docker:build` | Build the Docker image                                |
| `npm run docker:ci`    | Run full CI pipeline in container                     |
| `npm run docker:unit`  | Run unit tests in container                           |
| `npm run docker:e2e`   | Run E2E tests in container (Playwright pre-installed) |
| `npm run docker:dev`   | Start dev server in container                         |

First-time setup:

```bash
npm run docker:build
npm run docker:ci
```

Configuration is in `.docker/`.

## CI / GitHub Actions

| Workflow         | Trigger               | What it does                     |
| ---------------- | --------------------- | -------------------------------- |
| `ci.yml`         | PR and push to `main` | Lint, type-check, unit tests     |
| `deploy.yml`     | Push to `main`        | Build and deploy to GitHub Pages |
| `link-check.yml` | Post-deploy + weekly  | Check for broken links           |

## Contributing

Full contributing guide (content schemas, venue config, markdown reference) is at:

**[microhams.com/contributing](https://microhams.com/contributing)**

For code changes: branch off `main`, make changes, run `npm run ci`, open a PR.
