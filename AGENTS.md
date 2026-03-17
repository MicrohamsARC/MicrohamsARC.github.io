# MicroHAMS ARC — Repository Summary

**Purpose:** The public website for **MicroHAMS**, an amateur radio club (ARC), deployed at [microhams.com](https://microhams.com). It is a **static site** built with [Astro](https://astro.build) and hosted on GitHub Pages.

---

## Tech Stack

| Concern            | Tool                              |
| ------------------ | --------------------------------- |
| Framework          | Astro 5 (static site generator)   |
| Language           | TypeScript                        |
| Styling            | Vanilla CSS (ITCSS architecture)  |
| Unit tests         | Vitest                            |
| E2E tests          | Playwright (optional)             |
| Linting/formatting | ESLint + Prettier                 |
| Git hooks          | Husky + lint-staged               |
| Maps               | Leaflet.js                        |
| Math rendering     | remark-math + rehype-mathjax      |
| Dates/times        | `@js-temporal/polyfill`           |
| CI/CD              | GitHub Actions → GitHub Pages     |
| Docker             | Optional, for reproducible CI/E2E |

---

## Content Collections (`src/content/`)

Four Markdown-driven content types, each with Zod-validated schemas:

- **`articles/`** — Technical articles and guides (SDR, digital modes, filters, DXpeditions)
- **`docs/`** — Reference documentation (antenna theory, APRS gateways)
- **`events/`** — Club events and meetings (monthly meetings, field day, swap meets), optionally with images
- **`pages/`** — Static informational pages (About)

---

## Site Sections (`src/pages/`)

- `/` — Homepage
- `/articles/` — Article listing + individual article pages
- `/docs/` — Docs listing + individual doc pages
- `/events/` — Event listing + individual event pages
- `/tags/` — Tag-based content browsing
- `/search` — Client-side search (powered by a generated `search-index.json`)
- `/about` — About the club
- `/contributing/` — A rich, multi-page contributor guide (schemas, venues, markdown, typography, etc.)

---

## Key Source Directories

| Path                 | Role                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/components/`    | Reusable Astro components (header, footer, search bar, event cards/maps)                               |
| `src/layouts/`       | Page layout wrappers (Root, Page, Markdown, Docs)                                                      |
| `src/styles/`        | ITCSS-layered CSS (settings/tokens → typography → reset → elements → layouts → components → utilities) |
| `src/site.config.ts` | Central config for venues, recurring meeting details, etc.                                             |
| `src/utils/`         | Shared utilities (event time formatting, content helpers)                                              |
| `src/lib/`           | Client-side logic (error boundaries, datetime toggles)                                                 |
| `scripts/`           | Build/validation scripts (CI checks, version verification, AI-driven validation, pre-push)             |
| `.docker/`           | Dockerfile + Compose for containerized CI and E2E                                                      |

---

## Common Commands

| Command              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | Start development server (typically `http://localhost:4321`) |
| `npm run build`      | Build static site to `dist/`                                 |
| `npm run preview`    | Preview production build locally                             |
| `npm test`           | Unit tests in watch mode (Vitest)                            |
| `npm run test:run`   | Unit tests single run                                        |
| `npm run test:e2e`   | E2E tests via Playwright (auto-installs browsers if needed)  |
| `npm run lint`       | Check for lint errors                                        |
| `npm run lint:fix`   | Auto-fix lint errors                                         |
| `npm run type-check` | TypeScript + Astro validation                                |
| `npm run ci`         | Full local validation (lint, types, unit tests, build)       |
