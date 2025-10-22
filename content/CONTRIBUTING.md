# Contributing to MicroHAMS

Thank you for your interest in contributing to MicroHAMS! This guide will help you create content that follows our design principles and technical standards.

## Content Guidelines

### General Principles

1. **Accuracy First**: All technical information must be verified and correct
2. **Clear Communication**: Write for clarity, not cleverness
3. **Complete Documentation**: Provide enough detail for readers to reproduce results
4. **Proper Attribution**: Always credit sources and original authors

### Writing Style

- Use active voice
- Keep sentences concise
- Define technical terms on first use
- Include practical examples
- Add code comments where helpful

## Adding Content

### Articles

Articles are technical guides, tutorials, and how-to content.

**Location**: `content/articles/`

**Front Matter Template**:
```yaml
---
title: "Your Article Title"
description: "Brief description (1-2 sentences)"
author: "Your Name or MicroHAMS Team"
date: 2024-10-21  # YYYY-MM-DD
featured: false    # Set true for homepage feature
tags: ["tag1", "tag2"]
category: "tutorials"  # tutorials, guides, reviews, etc.
---
```

**Naming Convention**: Use kebab-case: `getting-started-with-sdr.md`

### Documentation

Documentation provides reference materials and technical specifications.

**Location**: `content/docs/`

**Front Matter Template**:
```yaml
---
title: "Documentation Title"
description: "Brief description"
section: "fundamentals"  # Used for grouping
order: 1                 # Sort order within section
toc: true                # Include table of contents
---
```

### Projects

Projects document complete builds with instructions.

**Location**: `content/projects/`

**Front Matter Template**:
```yaml
---
title: "Project Name"
description: "What it does"
status: "active"  # active, completed, archived
startDate: 2024-09-01
endDate: 2024-10-01  # Optional
technologies: ["Raspberry Pi", "Python"]
repository: "https://github.com/microhams/project-name"
website: "https://example.com"  # Optional
---
```

**Project Content Should Include**:
- Overview and purpose
- Component list with costs
- Step-by-step instructions
- Code examples
- Troubleshooting tips
- Future enhancements

## Design System Usage

### Do's and Don'ts

✅ **DO**:
- Use semantic HTML (`article`, `section`, `nav`)
- Use layout primitives (`stack-4`, `cluster`, `center`)
- Use design tokens (CSS custom properties)
- Use data attributes for state (`data-variant="primary"`)
- Keep accessibility in mind

❌ **DON'T**:
- Write custom CSS unless absolutely necessary
- Use inline styles (except for dynamic values)
- Create duplicate components
- Use magic numbers
- Ignore responsive design

### Layout Patterns

**Vertical Spacing**:
```html
<div class="stack-4">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

**Horizontal Groups**:
```html
<div class="cluster">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

**Content Container**:
```html
<div class="center">
  <p>Constrained content (max 48rem)</p>
</div>
```

**Card**:
```html
<article class="card">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
    <p class="card__description">Description</p>
  </div>
  <div class="card__content">
    Main content
  </div>
  <div class="card__footer">
    Footer content
  </div>
</article>
```

## Markdown Features

### Code Blocks

Use fenced code blocks with language specification:

```markdown
```python
def hello():
    print("Hello, world!")
```
```

### Math Notation

Use LaTeX syntax for equations:

```markdown
Inline: $E = mc^2$

Block:
$$
\lambda = \frac{c}{f}
$$
```

### Tables

Use Markdown tables for structured data:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Images

```markdown
![Alt text](./image.png)
```

Place images in `public/images/` directory.

## Testing Your Content

### Local Preview

1. Start the dev server:
```bash
npm run dev
```

2. Navigate to your content:
   - Articles: `http://localhost:4321/articles/your-slug`
   - Docs: `http://localhost:4321/docs/your-slug`
   - Projects: `http://localhost:4321/projects/your-slug`

3. Check for:
   - Proper rendering
   - Broken links
   - Image loading
   - Responsive behavior
   - Typography hierarchy

### Build Test

Before submitting, ensure the site builds:

```bash
npm run build
```

## Pull Request Process

1. **Fork the repository**

2. **Create a feature branch**:
```bash
git checkout -b content/your-article-name
```

3. **Add your content** following the guidelines above

4. **Test locally**:
```bash
npm run dev
npm run build
```

5. **Commit with clear message**:
```bash
git commit -m "Add: Getting Started with SDR article"
```

6. **Push to your fork**:
```bash
git push origin content/your-article-name
```

7. **Open a Pull Request** with:
   - Clear title describing the content
   - Description of what you're adding
   - Any relevant context or sources

### PR Checklist

- [ ] Content follows writing guidelines
- [ ] Front matter is complete and correct
- [ ] Code examples are tested and work
- [ ] Images are optimized (<500KB each)
- [ ] Links are valid
- [ ] Site builds without errors
- [ ] No spelling/grammar errors

## CSS Contributions

If you need to add CSS (rare), follow these rules:

1. **Extract at second occurrence** - First use inline, second use create class
2. **Use design tokens** - Never magic numbers
3. **Follow ITCSS layers** - Add to appropriate layer
4. **Document your decision** - Add comment explaining why

Example:
```css
/* Optical adjustment: compensate for circular letterforms in display text */
.display-heading {
  letter-spacing: var(--tracking-tight);
}
```

## Questions?

- Open an issue for clarification
- Check existing content for examples
- Review the design system reference in README

## Code of Conduct

- Be respectful and constructive
- Focus on technical merit
- Welcome newcomers
- Give credit where due
- Assume good intentions

Thank you for contributing to MicroHAMS! 📻
