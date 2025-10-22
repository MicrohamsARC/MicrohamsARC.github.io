# Stack Spacing Architecture

## The Question

"The cards in the stack have no margin around them. How should margins be implemented in stack?"

## The Vignelli Answer

**Don't add margins to Stack.** Stack is a **composition primitive** that handles internal spacing only.

Following Vignelli's principle: **"Discipline and appropriateness are the key"**

## How Stack Works

### Stack's Responsibility
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4); /* Spacing BETWEEN items */
}

.stack > * {
  margin-block: 0; /* Remove child margins */
}
```

**Stack controls:**
- ✅ Vertical spacing **between** items (via `gap`)
- ✅ Removes child margins (prevents double-spacing)

**Stack does NOT control:**
- ❌ Margins around the stack container
- ❌ Padding around the stack container

## The Composition Pattern

### ❌ Wrong Approach: Adding margins to Stack

```html
<!-- Anti-pattern: Don't do this -->
<div class="stack-4" style="margin: 2rem;">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
</div>
```

**Problems:**
- Violates single responsibility
- Not composable
- Hard to override

### ✅ Correct Approach: Compose Primitives

```html
<!-- Pattern 1: Wrapper for horizontal margins -->
<div class="wrapper">
  <div class="stack-4">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
  </div>
</div>

<!-- Pattern 2: Region for vertical margins -->
<section class="region">
  <div class="stack-4">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
  </div>
</section>

<!-- Pattern 3: Box for all-around padding -->
<div class="box--lg">
  <div class="stack-4">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
  </div>
</div>

<!-- Pattern 4: Full composition -->
<section class="region">
  <div class="wrapper">
    <div class="stack-6">
      <h2>Section Title</h2>
      <div class="grid grid--auto-fit">
        <div class="card">Card 1</div>
        <div class="card">Card 2</div>
        <div class="card">Card 3</div>
      </div>
    </div>
  </div>
</section>
```

## Real-World Examples

### Example 1: Homepage Featured Articles

**Current implementation:**
```html
<section class="region" style="background-color: var(--color-surface-muted);">
  <div class="wrapper">
    <div class="stack-8">
      <h2 class="text-center">Featured Articles</h2>
      <div class="grid grid--auto-fit">
        {articles.map((article) => (
          <article class="card" data-variant="interactive">
            <!-- Card content -->
          </article>
        ))}
      </div>
    </div>
  </div>
</section>
```

**Spacing breakdown:**
- `region` → 64px vertical padding (top & bottom)
- `wrapper` → Horizontal margins (auto) + side gutters (16-32px responsive)
- `stack-8` → 32px gap between heading and grid
- `grid` → Automatic gaps between cards

### Example 2: Article List Page

```html
<section class="region">
  <div class="wrapper">
    <div class="center">
      <div class="stack-8">
        {articles.map((article) => (
          <article class="card" data-variant="interactive">
            <!-- Card content -->
          </article>
        ))}
      </div>
    </div>
  </div>
</section>
```

**Spacing breakdown:**
- `region` → Vertical padding around section
- `wrapper` → Page-width constraint + side gutters
- `center` → Max-width constraint + centering
- `stack-8` → 32px gap between cards

## Spacing Primitive Responsibilities

### Stack
**Purpose:** Vertical rhythm between items  
**Controls:** Gap between children  
**Usage:** `<div class="stack-4">`

### Cluster
**Purpose:** Horizontal grouping  
**Controls:** Gap between items  
**Usage:** `<div class="cluster cluster--center">`

### Box
**Purpose:** Internal padding  
**Controls:** Padding inside container  
**Usage:** `<div class="box--lg">`

### Region
**Purpose:** Section vertical spacing  
**Controls:** Padding-block (top & bottom)  
**Usage:** `<section class="region">`

### Wrapper
**Purpose:** Page-width constraint  
**Controls:** Max-width + horizontal padding  
**Usage:** `<div class="wrapper">`

### Center
**Purpose:** Content centering  
**Controls:** Max-width + horizontal margins  
**Usage:** `<div class="center">`

## When Cards Need Margin

If individual cards need internal spacing from their edges:

### Option 1: Add padding to cards (preferred)
```css
.card {
  padding: var(--space-6); /* Already has this */
}
```

### Option 2: Use Box primitive
```html
<div class="stack-4">
  <div class="box--md">
    <div class="card">Card 1</div>
  </div>
  <div class="box--md">
    <div class="card">Card 2</div>
  </div>
</div>
```

### Option 3: Grid with gaps
```html
<div class="grid grid--auto-fit grid--gap-lg">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
</div>
```

## Common Patterns

### Pattern: Page Section with Cards

```html
<section class="region">           <!-- 64px top/bottom -->
  <div class="wrapper">             <!-- Page width + side gutters -->
    <div class="stack-8">           <!-- 32px internal gaps -->
      <h2>Section Title</h2>
      <div class="stack-4">         <!-- 16px gaps between cards -->
        <article class="card">Card 1</article>
        <article class="card">Card 2</article>
        <article class="card">Card 3</article>
      </div>
    </div>
  </div>
</section>
```

### Pattern: Two-Column Layout with Cards

```html
<section class="region">
  <div class="wrapper">
    <div class="proportion--golden">
      <!-- Main content -->
      <div class="stack-6">
        <h2>Main Content</h2>
        <div class="stack-4">
          <article class="card">Card 1</article>
          <article class="card">Card 2</article>
        </div>
      </div>
      
      <!-- Sidebar -->
      <aside class="stack-4">
        <h3>Related</h3>
        <div class="card">Sidebar card</div>
      </aside>
    </div>
  </div>
</section>
```

### Pattern: Centered Article List

```html
<section class="region">
  <div class="wrapper">
    <div class="center--measure">    <!-- 65ch max-width -->
      <div class="stack-6">
        <article class="card">Card 1</article>
        <article class="card">Card 2</article>
        <article class="card">Card 3</article>
      </div>
    </div>
  </div>
</section>
```

## Vignelli's Guidance

**"The grid is not the solution, it's the problem to be solved."**

The Stack primitive provides the **vertical rhythm**. Other primitives provide the **spatial context**:

1. **Region** - Sectional breathing room (vertical)
2. **Wrapper** - Page boundaries (horizontal)
3. **Center** - Content focus (centering)
4. **Box** - Internal padding (all sides)
5. **Grid** - Multi-dimensional spacing

## Debugging Spacing Issues

If cards appear cramped:

### 1. Check if Region is used
```html
<!-- ❌ Missing vertical space -->
<div class="wrapper">
  <div class="stack-4">Cards...</div>
</div>

<!-- ✅ Has vertical space -->
<section class="region">
  <div class="wrapper">
    <div class="stack-4">Cards...</div>
  </div>
</section>
```

### 2. Check if Wrapper is used
```html
<!-- ❌ Cards touch viewport edges -->
<div class="stack-4">Cards...</div>

<!-- ✅ Cards have side gutters -->
<div class="wrapper">
  <div class="stack-4">Cards...</div>
</div>
```

### 3. Check Stack gap size
```html
<!-- Too tight -->
<div class="stack-1">Cards...</div>  <!-- 4px gap -->

<!-- Too loose -->
<div class="stack-16">Cards...</div> <!-- 64px gap -->

<!-- Just right (most cases) -->
<div class="stack-4">Cards...</div>  <!-- 16px gap -->
<div class="stack-6">Cards...</div>  <!-- 24px gap -->
```

## Responsive Behavior

All composition primitives are responsive:

```css
/* Wrapper adjusts gutters by viewport */
@media (max-width: 768px) {
  .wrapper { padding-inline: 16px; }
}

@media (min-width: 1025px) {
  .wrapper { padding-inline: 32px; }
}
```

Stack gaps remain consistent (intentionally) because **vertical rhythm should be constant** across viewports.

## Best Practices

### ✅ Do:
- Compose primitives (stack + wrapper + region)
- Use semantic spacing (stack-4, stack-6, stack-8)
- Let each primitive do one thing well

### ❌ Don't:
- Add inline styles for margins
- Override Stack with custom margins
- Mix margin and gap (choose one approach)

## Summary

**Stack does NOT need margin implementation.** It's designed to work **with other primitives** to create proper spacing:

- **Stack** = gaps between items
- **Wrapper** = horizontal margins
- **Region** = vertical margins
- **Box** = all-around padding

This is the **Vignelli way**: systematic, composable, disciplined.

---

**Date:** October 21, 2025  
**Philosophy:** Vignelli Canon - Composition over Configuration  
**Principle:** "Each component should do one thing and do it well"
