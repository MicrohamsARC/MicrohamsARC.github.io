# MicroHAMS Website

The public website for **MicroHAMS Amateur Radio Club**, deployed at [microhams.com](https://microhams.com).

Built with [Astro](https://astro.build) and hosted on GitHub Pages. Pushing to `main` deploys automatically.

---

## Adding and Updating Content

All site content lives in `src/content/` as Markdown files. The full guide is at:

**[microhams.com/contributing](https://microhams.com/contributing)**

Quick links:

- [Events](https://microhams.com/contributing/events) — Meetings, field days, swap meets
- [Articles](https://microhams.com/contributing/articles) — Guides, tutorials, news
- [Documentation](https://microhams.com/contributing/docs) — Technical reference
- [Schema Reference](https://microhams.com/contributing/schemas) — All content fields

### Typical workflow

1. Create a branch, add or edit a Markdown file in `src/content/`
2. Open a pull request — CI runs automatically
3. Merge to `main` — site deploys within a minute or two

---

## Deployment

| What           | Where                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| Live site      | [microhams.com](https://microhams.com)                                    |
| Hosting        | GitHub Pages                                                              |
| Deploy trigger | Push or merge to `main`                                                   |
| CI             | GitHub Actions (lint, type-check, unit tests, build, internal link check) |

Deployment status is visible under the [Actions tab](../../actions).

---

## Automation

| Bot            | What it does                                                          |
| -------------- | --------------------------------------------------------------------- |
| **Dependabot** | Opens a grouped PR each Wednesday with minor/patch dependency updates |

Dependabot PRs are safe to merge if CI passes. Major version bumps are excluded and handled manually.

Internal links are verified as part of CI (`npm run check:links`) on every PR and push — no separate workflow or third-party action.

---

## Repository Layout

```text
src/content/        # All Markdown content (events, articles, docs, pages)
src/pages/          # Route files and contributing guide
src/components/     # Astro components
src/layouts/        # Page layouts
src/styles/         # CSS (ITCSS architecture)
src/site.config.ts  # Venues, recurring meeting links, site-wide settings
.github/            # CI, deploy, and Dependabot config
```

---

## Developer Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for local setup, available scripts, testing, and Docker.
