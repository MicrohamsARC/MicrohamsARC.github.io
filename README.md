# MicroHAMS

A static website for MicroHAMS, built with [Astro](https://astro.build).

## Quick Start

```bash
npm install
npm run dev
```

The dev server URL will be shown in the terminal (typically `http://localhost:4321`).

## Project Structure

```text
├── src/
│   ├── content/          # Markdown content collections
│   │   ├── articles/     # Technical articles and guides
│   │   ├── docs/         # Reference documentation
│   │   ├── events/       # Club events and meetings
│   │   ├── pages/        # Static pages (about)
│   │   └── config.ts     # Content schemas
│   ├── components/       # Astro components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route files
│   ├── styles/           # CSS (ITCSS architecture)
│   └── site.config.ts    # Site configuration (venues, meetings)
├── playwright/           # E2E tests
├── scripts/              # Build and validation scripts
└── public/               # Static assets
```

## Scripts

### Development

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Development server with HMR      |
| `npm run build`   | Build static site to `dist/`     |
| `npm run preview` | Preview production build locally |

### Testing

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm test`         | Unit tests in watch mode (Vitest) |
| `npm run test:run` | Unit tests single run             |

**E2E Tests (optional):**

Playwright is optional and not installed by default. The test commands will guide you through setup if needed:

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

### Git Hooks

Pre-configured via Husky:

- **pre-commit**: Runs lint-staged (ESLint + Prettier) and `astro check`
- **pre-push**: Runs `pre-push:fast` validation

### Docker (Advanced)

Docker provides a consistent environment for CI and E2E testing, useful when:

- Local Playwright browser installation fails or behaves differently
- You want to match the exact CI environment locally
- Running on a machine without Node.js installed

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

## Adding Content

For detailed content guidelines, schema documentation, and examples, see:

**[Contributing Guide](https://microhams.com/contributing)**

The contributing guide includes comprehensive information on:

- Creating articles, events, and documentation
- Content schemas and required fields
- Venue and meeting configuration
- Auto-generated schema documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run `npm run ci` to validate
5. Submit a pull request

## Deployment

Push to `main` triggers GitHub Actions deployment to GitHub Pages.

Site: <https://microhams.com>
