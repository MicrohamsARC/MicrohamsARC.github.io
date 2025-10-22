# Typography Update: Geist Font Family

## Overview

Updated the MicroHAMS website to use **Geist** and **Geist Mono** typefaces from Google Fonts, replacing the system font stack with a modern, professionally designed font family.

## Implementation Date

October 21, 2025

## Changes Made

### 1. Google Fonts Integration

**File:** `src/layouts/BaseLayout.astro`

Added Google Fonts CDN links in the `<head>` section:

```html
<!-- Google Fonts - Geist -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Font Weights Loaded:**
- 400 (Normal)
- 500 (Medium)
- 600 (Semibold)
- 700 (Bold)

**Performance Optimizations:**
- `rel="preconnect"` for DNS prefetching
- `display=swap` for font display strategy (prevents FOIT - Flash of Invisible Text)
- Both fonts loaded in a single request to minimize HTTP overhead

### 2. Design Token Updates

**File:** `src/styles/00-settings/_tokens.css`

Updated font family tokens:

```css
/* Font Families - Geist from Google Fonts */
--font-sans: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: 'Geist Mono', ui-monospace, "SF Mono", Monaco, "Cascadia Code", 
             "Roboto Mono", Consolas, "Liberation Mono", monospace;
```

**Fallback Strategy:**
- Primary: Geist / Geist Mono
- Secondary: System UI fonts
- Tertiary: Common cross-platform fonts
- Final: Generic font family (sans-serif / monospace)

### 3. Typography Base Styles

**File:** `src/styles/03-elements/_typography.css`

Applied font-family to body element:

```css
body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--tracking-normal);
}
```

## About Geist

### Design Philosophy

**Geist** is a modern sans-serif typeface designed by Vercel, optimized for:
- **Legibility** - Clear character differentiation at all sizes
- **Screen rendering** - Optimized for digital displays
- **Versatility** - Works across UI, body text, and display
- **Modern aesthetics** - Clean, geometric, neutral

**Geist Mono** is the monospaced companion, designed for:
- **Code clarity** - Distinct characters for programming
- **Consistent width** - Perfect for data tables and terminals
- **Matching aesthetic** - Pairs harmoniously with Geist

### Characteristics

- **Style:** Geometric sans-serif with humanist touches
- **x-height:** Tall for improved readability at small sizes
- **Apertures:** Open for better legibility
- **Contrast:** Low, maintaining clarity across weights
- **Terminals:** Clean cuts, minimal embellishment

### Use Cases

**Geist (Sans):**
- Body text
- Headings
- UI elements
- Navigation
- Buttons and labels

**Geist Mono:**
- Code blocks
- Inline code
- Technical documentation
- Terminal output
- Data tables

## Design System Integration

The Geist font family integrates seamlessly with our existing design system:

### Typography Scale (Perfect Fourth - 1.333)
- All font sizes preserved
- Line heights maintained
- Letter spacing unchanged

### Font Weights
The loaded weights map to our tokens:
- 400 → `--font-weight-normal`
- 500 → `--font-weight-medium`
- 600 → `--font-weight-semibold`
- 700 → `--font-weight-bold`

### Vignelli Principles
Geist aligns with Vignelli's typography philosophy:
- **Systematic:** Consistent proportions and weights
- **Timeless:** Modern without trends
- **Clarity:** Legibility above decoration
- **Restraint:** No unnecessary flourishes

## Performance Considerations

### Font Loading Strategy

**Method:** Google Fonts CDN
- **Pros:** Global CDN, browser caching, automatic optimization
- **Cons:** Third-party dependency, requires internet connection

**Display Strategy:** `font-display: swap`
- Shows fallback font immediately
- Swaps to Geist when loaded
- Prevents blocking page render

### File Size

Approximate sizes (woff2 format):
- **Geist:** ~20-30KB per weight
- **Geist Mono:** ~25-35KB per weight
- **Total:** ~180-260KB for all weights

### Loading Time

- **DNS Prefetch:** `rel="preconnect"` reduces latency
- **First Paint:** Fallback fonts prevent delay
- **Font Swap:** Typically < 100ms on good connections

## Browser Support

Geist supports all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Fallback fonts ensure support for:
- Legacy browsers
- Font loading failures
- Users with fonts disabled

## Testing Checklist

- [x] Google Fonts links added to BaseLayout
- [x] Font tokens updated in design system
- [x] Body font-family applied
- [x] All 11 pages build successfully
- [x] Geist fonts appear in built HTML
- [x] Fallback fonts specified
- [x] Font display strategy configured
- [x] Preconnect hints added
- [x] No build errors or warnings

## Verification

Build output confirms successful implementation:

```bash
✓ 11 page(s) built in 621ms
```

HTML includes font links:
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Visual Impact

### Before (System Fonts)
- Variable appearance across platforms
- Less consistent character widths
- Different rendering qualities

### After (Geist)
- Consistent appearance on all platforms
- Optimized readability
- Professional, modern aesthetic
- Better code display with Geist Mono

## Future Considerations

### Potential Optimizations

1. **Self-hosting:** Host fonts locally to eliminate third-party dependency
2. **Variable fonts:** Use Geist variable font for reduced file size
3. **Subset fonts:** Load only required character sets
4. **Preload:** Add `<link rel="preload">` for critical fonts

### Font Feature Exploration

Geist supports OpenType features:
- Tabular figures for data alignment
- Alternative glyphs for stylistic variants
- Ligatures for improved text flow

## Migration Notes

### No Breaking Changes
- All existing styles preserved
- Typography scale unchanged
- Component appearance consistent
- Layout unaffected

### Visual Improvements
- Sharper rendering on high-DPI displays
- More consistent letter spacing
- Better code readability
- Improved hierarchy perception

## Related Documentation

- `docs/EVENTS_SYSTEM.md` - Events system documentation
- `docs/IMPLEMENTATION_SUMMARY.md` - Recent implementation summary
- `src/styles/00-settings/_tokens.css` - Design tokens including typography
- `src/styles/03-elements/_typography.css` - Typography styles

## References

- **Geist Font:** https://vercel.com/font
- **Google Fonts:** https://fonts.google.com
- **Font Display:** https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- **Font Loading:** https://web.dev/articles/font-best-practices

---

**Updated:** October 21, 2025  
**Status:** ✅ Complete and Verified  
**Build Status:** ✅ All 11 pages building successfully  
**Font Loading:** ✅ Geist and Geist Mono via Google Fonts CDN
