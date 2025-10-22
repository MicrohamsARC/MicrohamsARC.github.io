# MicroHAMS

A GitHub Pages site for the MicroHAMS amateur radio community, built with Astro and a Vignelli-inspired design system.

## 🎨 Design Philosophy

This site follows the **Vignelli Doctrine** - a systematic approach to design emphasizing:

- **Discipline Over Dogma**: Consistent structure without monotonous repetition
- **Typography IS the Interface**: Swiss design rationality with typographic excellence
- **Separation of Concerns**: Configuration separated from framework
- **OHIO Principle**: Only Handle It Once - zero duplication

### CSS Architecture

The site uses **ITCSS (Inverted Triangle CSS)** for maintainable, scalable stylesheets:

```
styles/
├── 00-settings/    # Design tokens (typography, colors, spacing)
├── 02-generic/     # Reset and normalize
├── 03-elements/    # Base HTML element styles
├── 04-layouts/     # Composable layout primitives (Stack, Cluster, Center)
├── 05-components/  # Semantic UI components
└── 06-utilities/   # Single-purpose helper classes
```

Key features:
- **Perfect Fourth typographic scale** (1.333 ratio)
- **Powers-of-2 spatial system** (4px base unit)
- **OKLCH color space** for perceptual uniformity
- **Logical properties** for internationalization
- **Data attributes for state** (HMR-friendly)

## 📁 Content Structure

Content is organized using **Astro Content Collections** with TypeScript schemas:

```
content/
├── articles/    # Blog posts and guides
├── docs/        # Technical documentation
├── projects/    # Project documentation
└── pages/       # General site pages
```

### Front Matter Examples

**Article:**
```yaml
---
title: "Getting Started with SDR"
description: "Introduction to Software Defined Radio"
author: "MicroHAMS Team"
date: 2024-10-15
featured: true
tags: ["sdr", "beginner"]
category: "tutorials"
---
```

**Documentation:**
```yaml
---
title: "Antenna Theory Basics"
section: "fundamentals"
order: 1
toc: true
---
```

**Project:**
```yaml
---
title: "Raspberry Pi APRS Gateway"
status: "active"
startDate: 2024-09-01
technologies: ["Raspberry Pi", "RTL-SDR"]
repository: "https://github.com/microhams/aprs-gateway"
---
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding Content

1. **Create a markdown file** in the appropriate collection folder:
   ```bash
   content/articles/my-new-article.md
   ```

2. **Add front matter** following the schema for that collection

3. **Write content** in Markdown with full CommonMark support

4. **Preview locally** - changes appear immediately in dev mode

### Layout Primitives

Use composable layout components instead of custom CSS:

```html
<!-- Vertical stack with consistent spacing -->
<div class="stack-4">
  <h2>Title</h2>
  <p>Content</p>
</div>

<!-- Horizontal cluster with wrapping -->
<div class="cluster">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

<!-- Centered content with max-width -->
<div class="center">
  <p>Constrained content</p>
</div>

<!-- Responsive grid -->
<div class="grid grid--auto-fit">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
</div>
```

## 🌐 GitHub Pages Deployment

The site automatically deploys to GitHub Pages via GitHub Actions.

### Setup

1. **Enable GitHub Pages** in repository settings:
   - Source: GitHub Actions
   - Branch: main

2. **Update site URL** in `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://microhams.net',
     // If using a subdirectory:
     // base: '/repository-name',
   });
   ```

3. **Push to main branch** - deployment happens automatically

### Workflow

The `.github/workflows/deploy.yml` workflow:
- Triggers on push to main
- Builds the Astro site
- Deploys to GitHub Pages
- Supports manual dispatch

## 📐 Design System Reference

### Typography Scale

| Class | Size | Use |
|-------|------|-----|
| `text-xs` | 12px | Captions, labels |
| `text-sm` | 14px | Secondary text |
| `text-base` | 16px | Body text (default) |
| `text-lg` | 21px | Large body |
| `text-xl` | 28px | H3 |
| `text-2xl` | 38px | H2 |
| `text-3xl` | 51px | H1 |
| `text-4xl` | 67px | Display |

### Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | 4px | Minimal |
| `--space-2` | 8px | Tight |
| `--space-4` | 16px | Base rhythm |
| `--space-8` | 32px | Section spacing |
| `--space-16` | 64px | Major sections |
| `--space-24` | 96px | Large sections |

### Color Tokens

```css
--color-text           /* Primary text */
--color-text-muted     /* Secondary text */
--color-text-subtle    /* Tertiary text */
--color-border         /* Primary borders */
--color-surface        /* Background */
--color-accent         /* Primary accent (use sparingly) */
```

## 🛠️ Project Structure

```
microhams/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── public/                     # Static assets
├── src/
│   ├── content/               # Markdown content
│   │   ├── articles/
│   │   ├── docs/
│   │   ├── pages/
│   │   ├── projects/
│   │   └── config.ts          # Content schemas
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Main site layout
│   │   └── MarkdownLayout.astro
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── articles/
│   │   ├── docs/
│   │   └── projects/
│   └── styles/
│       ├── 00-settings/       # Design tokens
│       ├── 02-generic/        # Reset
│       ├── 03-elements/       # Typography
│       ├── 04-layouts/        # Layout primitives
│       ├── 05-components/     # UI components
│       ├── 06-utilities/      # Utilities
│       └── main.css           # Main orchestration
├── astro.config.mjs           # Astro configuration
├── package.json
└── tsconfig.json
```

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [Every Layout](https://every-layout.dev/) - Layout primitive inspiration

## 📄 License

Content: Creative Commons BY-SA 4.0  
Code: MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your content following the established patterns
4. Submit a pull request

For questions or discussions, open an issue on GitHub.
