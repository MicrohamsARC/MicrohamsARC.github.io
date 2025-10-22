# MicroHAMS Quick Reference

## 🚀 Getting Started

```bash
npm install           # Install dependencies
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build for production
npm run preview      # Preview build
```

## 📝 Adding Content

### New Article

```bash
# Create file
touch content/articles/my-article.md
```

```yaml
---
title: "Article Title"
description: "Brief description"
author: "Your Name"
date: 2024-10-21
featured: false
tags: ["tag1", "tag2"]
category: "tutorials"
---

# Your content here...
```

### New Doc

```bash
touch content/docs/my-doc.md
```

```yaml
---
title: "Doc Title"
section: "fundamentals"
order: 1
toc: true
---
```

### New Project

```bash
touch content/projects/my-project.md
```

```yaml
---
title: "Project Name"
status: "active"
technologies: ["Tech1", "Tech2"]
repository: "https://github.com/..."
---
```

## 🎨 Layout Primitives

```html
<!-- Vertical Stack -->
<div class="stack-4">
  <h2>Title</h2>
  <p>Content</p>
</div>

<!-- Horizontal Cluster -->
<div class="cluster">
  <button>1</button>
  <button>2</button>
</div>

<!-- Centered Container -->
<div class="center">
  <p>Content</p>
</div>

<!-- Responsive Grid -->
<div class="grid grid--auto-fit">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
</div>
```

## 🎯 Components

### Button
```html
<button class="button" data-variant="primary">Click</button>
<button class="button" data-variant="secondary">Click</button>
<button class="button" data-variant="ghost">Click</button>
```

### Card
```html
<article class="card">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
    <p class="card__description">Description</p>
  </div>
  <div class="card__content">Content</div>
  <div class="card__footer">Footer</div>
</article>
```

### Badge
```html
<span class="badge">Default</span>
<span class="badge" data-variant="accent">Accent</span>
```

## 📐 Design Tokens

### Typography
```css
var(--text-xs)      /* 12px */
var(--text-sm)      /* 14px */
var(--text-base)    /* 16px */
var(--text-lg)      /* 21px */
var(--text-xl)      /* 28px */
var(--text-2xl)     /* 38px */
var(--text-3xl)     /* 51px */
var(--text-4xl)     /* 67px */
```

### Spacing
```css
var(--space-1)      /* 4px */
var(--space-2)      /* 8px */
var(--space-4)      /* 16px */
var(--space-8)      /* 32px */
var(--space-16)     /* 64px */
var(--space-24)     /* 96px */
```

### Colors
```css
var(--color-text)           /* Primary text */
var(--color-text-muted)     /* Secondary text */
var(--color-border)         /* Borders */
var(--color-surface)        /* Backgrounds */
var(--color-accent)         /* Accent (use sparingly) */
```

## 📁 File Structure

```
src/
├── content/
│   ├── articles/      # Blog posts
│   ├── docs/          # Documentation
│   ├── projects/      # Project docs
│   └── pages/         # Static pages
├── layouts/
│   ├── BaseLayout.astro
│   └── MarkdownLayout.astro
├── pages/             # Routes
│   ├── index.astro
│   ├── articles/
│   ├── docs/
│   └── projects/
└── styles/            # Design system
    ├── 00-settings/
    ├── 02-generic/
    ├── 03-elements/
    ├── 04-layouts/
    ├── 05-components/
    └── 06-utilities/
```

## 🌐 Deployment

```bash
# Push to GitHub
git add .
git commit -m "Add content"
git push origin main

# Automatic deployment via GitHub Actions
# Check progress: GitHub > Actions tab
```

## 📚 Documentation

- `MICROHAMS_README.md` - Complete guide
- `CONTRIBUTING.md` - How to contribute
- `CSS_GUIDE.md` - Design system details
- `PROJECT_SUMMARY.md` - What was built

## 🔍 Common Tasks

### Preview Article
```bash
npm run dev
# Visit: http://localhost:4321/articles/your-slug
```

### Check Build
```bash
npm run build
# Look for errors in output
```

### Test Responsive
```bash
npm run dev
# Open DevTools (Cmd+Opt+I)
# Click device toolbar (Cmd+Shift+M)
```

## 🎨 CSS Best Practices

✅ **DO**:
- Use design tokens
- Use layout primitives
- Use semantic HTML
- Use data attributes for state

❌ **DON'T**:
- Write custom CSS without need
- Use magic numbers
- Use inline styles
- Duplicate patterns

## 🆘 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules dist .astro
npm install
npm run build
```

**Port in use?**
```bash
# Dev server on different port
npm run dev -- --port 3000
```

**Content not showing?**
- Check front matter syntax
- Verify file location
- Check for `draft: true`
- Rebuild: `npm run build`

## 📞 Need Help?

- Check documentation files
- Review sample content
- Open GitHub issue
- Check Astro docs: https://docs.astro.build

---

**Quick tip**: Use `Cmd+Shift+F` (VS Code) to search across all files!
