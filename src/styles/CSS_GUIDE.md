# CSS Design System Guide

This guide explains the MicroHAMS CSS design system, based on Swiss design principles and ITCSS architecture.

## Philosophy

Our CSS follows these core principles:

1. **Discipline Over Dogma** - Systematic, not rigid
2. **Typography IS the Interface** - Text hierarchy drives all design decisions
3. **Only Handle It Once (OHIO)** - Zero duplication, extract at second use
4. **Semantic Clarity** - Self-documenting code

## Architecture: ITCSS Layers

```
styles/
├── 00-settings/     # Design tokens (no output)
├── 02-generic/      # Reset and normalize
├── 03-elements/     # HTML element defaults
├── 04-layouts/      # Layout primitives
├── 05-components/   # UI components
└── 06-utilities/    # Single-purpose classes
```

Specificity increases as you go down. Never skip layers.

## Design Tokens

Spatial, color, and layout tokens are defined in `00-settings/_tokens.css`.
**Type tokens** (sizes, leading, measure, tracking, weights, families) have a single source of
truth in `01-typography/_scale.css` and `_fonts.css` — never redefine them in `_tokens.css`.

### Typography Scale (web modular: ~1.2 text / ~1.25 display, 16px base)

```css
--text-sm: 0.875rem; /* 14px - labels */
--text-base: 1rem; /* 16px - body (MINIMUM) */
--text-md: 1.125rem; /* 18px - lead */
--text-lg: 1.25rem; /* 20px - h5 */
--text-xl: 1.5rem; /* 24px - h4 */
--text-2xl: 1.875rem; /* 30px - h3 */
--text-3xl: 2.25rem; /* 36px - h2 */
--text-4xl: 2.8125rem; /* 45px - h1 (capped for screens) */
```

The text band (12–20px) uses round, legible px steps; the **display band is exact alternating
1.2 / 1.25** (20→24→30→36→45). **Never use pixels for font sizes** — always use the scale. h1 is
capped at 45px; the old print φ=1.618 scale (up to ~84px) was poster-aggressive and collided at
h3/h4 on screen.

### Spacing (Powers of 2)

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-4: 1rem; /* 16px - Base rhythm */
--space-8: 2rem; /* 32px */
--space-16: 4rem; /* 64px */
--space-24: 6rem; /* 96px */
```

All spacing derives from `--space-unit: 4px`.

### Colors (OKLCH)

```css
/* Achromatic base */
--color-gray-500: oklch(53% 0 0);

/* Semantic colors */
--color-text: var(--color-gray-900);
--color-text-muted: var(--color-gray-600);
--color-border: var(--color-gray-200);
--color-surface: var(--color-white);
--color-accent: oklch(45% 0.22 240); /* single blue accent (hue 240); red retired */
```

**Why OKLCH?** Perceptually uniform - 50% lightness looks 50% bright.

## Layout Primitives

Composable building blocks. Use these instead of writing custom CSS.

### Stack - Vertical Rhythm

```html
<div class="stack-4">
  <h2>Title</h2>
  <p>Paragraph</p>
  <button>Action</button>
</div>
```

Creates consistent vertical spacing. Available: `stack-1` through `stack-16`.

### Cluster - Horizontal Groups

```html
<div class="cluster">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</div>
```

Wraps naturally. Use for inline groups.

### Center - Constrained Content

```html
<div class="center">
  <p>Maximum 48rem width, centered.</p>
</div>
```

Variants: `center--narrow`, `center--wide`, `center--full`.

### Grid - Responsive Layouts

```html
<div class="grid grid--auto-fit">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

Auto-fit creates responsive columns without media queries.

## Components

### Button

```html
<button class="button" data-variant="primary">Click Me</button>
```

**Variants** (use `data-variant`):

- `primary` - Main actions
- `secondary` - Alternative actions
- `ghost` - Subtle actions

**Sizes** (use `data-size`):

- `sm` - Compact
- (default) - Normal
- `lg` - Prominent

### Card

```html
<article class="card">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
    <p class="card__description">Description</p>
  </div>
  <div class="card__content">Main content here</div>
  <div class="card__footer">Footer content</div>
</article>
```

### Badge

```html
<span class="badge">Default</span> <span class="badge" data-variant="accent">Accent</span>
```

## Modern CSS Features

### Container Queries

Use for component-level responsiveness:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-title {
    font-size: var(--text-xl);
  }
}
```

### Logical Properties

Always use logical properties for internationalization:

```css
/* ✅ Good - works in RTL */
margin-inline: var(--space-4);
padding-block: var(--space-2);
border-inline-start: 1px solid;

/* ❌ Bad - assumes LTR */
margin-left: var(--space-4);
margin-right: var(--space-4);
```

### clamp() for Fluid Typography

```css
font-size: clamp(
  var(--text-xl),
  /* minimum */ 5vw + 1rem,
  /* preferred */ var(--text-3xl) /* maximum */
);
```

### :has() Relational Queries

```css
/* Style parent based on child state */
.form:has(input:invalid) {
  border-color: var(--color-error);
}
```

## Anti-Patterns

### ❌ Magic Numbers

```css
/* BAD */
margin-top: 23px;
```

```css
/* GOOD */
margin-block-start: var(--space-6);
```

### ❌ Deep Nesting

```css
/* BAD - too specific */
.header .nav ul li a.active {
  color: red;
}
```

```css
/* GOOD - flat specificity */
.nav__link[data-active='true'] {
  color: var(--color-accent);
}
```

### ❌ Mixing Concerns

```css
/* BAD - layout + theme + animation mixed */
.card {
  display: flex;
  color: red;
  animation: spin 2s;
}
```

```css
/* GOOD - separate concerns */
.card {
  /* Use layout primitives */
}

.card[data-variant='error'] {
  color: var(--color-error);
}
```

### ❌ ID Selectors

```css
/* BAD - too specific */
#header {
  padding: 20px;
}
```

```css
/* GOOD - reusable classes */
.site-header {
  padding: var(--space-5);
}
```

## Writing New CSS

### When to Extract a Component

1. **First use**: Use utility classes or inline styles
2. **Second use**: Extract to a component class
3. **Third use**: You should have extracted it already!

### Naming Conventions

**BEM for components**:

```css
.card {
}
.card__header {
}
.card__title {
}
.card--featured {
}
```

**Data attributes for state**:

```html
<button data-variant="primary" data-state="loading"></button>
```

**Kebab-case for utilities**:

```css
.text-center {
}
.stack-4 {
}
```

### Documentation Comments

```css
/* ✅ Explains WHY */
/* Optical adjustment: compensate for circular letterforms */
.heading {
  letter-spacing: var(--tracking-tight);
}

/* ❌ States the obvious */
/* Make text red */
.error {
  color: red;
}
```

## Accessibility

### Focus States

Always provide visible focus:

```css
.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Color Contrast

Maintain WCAG AA minimum (4.5:1 for body text):

```css
/* Use text-muted for secondary text */
color: var(--color-text-muted); /* 4.5:1+ contrast */
```

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance

### Critical CSS

Inline critical styles in `<head>`:

```html
<style>
  :root {
    /* tokens */
  }
  body {
    /* base typography */
  }
  .above-fold {
    /* hero section */
  }
</style>
```

### Font Loading

Fonts are **self-hosted via Astro's native Fonts API** (configured in `astro.config.mjs`, injected by
`<Font>` in `src/layouts/RootLayout.astro`; woff2 files in `src/assets/fonts/`). Astro preloads them
and generates metric-matched fallback faces, so text does not swap or reflow on load (no FOUT). There
is no `@font-face` to hand-write and no third-party request. Reference fonts only through the
`--font-sans` / `--font-mono` tokens (defined once in `01-typography/_fonts.css`); never paste a raw
or near-name family string into CSS.

## Quality Checklist

Before committing CSS:

- [ ] All values use design tokens
- [ ] No duplication (DRY enforced)
- [ ] Logical properties used
- [ ] Accessible contrast ratios (WCAG AA+)
- [ ] Mobile-first approach
- [ ] Performance budget met (<50KB gzipped)
- [ ] Self-documenting with clear names
- [ ] Commented where non-obvious

## Resources

- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [Every Layout](https://every-layout.dev/)
- [Modern CSS](https://moderncss.dev/)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [OKLCH Color Picker](https://oklch.com/)

---

**Remember**: Every rule must justify its existence. Every token serves the hierarchy. Every pixel has purpose.
