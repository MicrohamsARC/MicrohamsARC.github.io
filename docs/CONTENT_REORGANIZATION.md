# Content Directory Reorganization Summary

## 📁 What Changed

The content directory has been moved from `./src/content` to `./content` (at the project root) to better separate **content** (managed by writers/editors) from **code** (managed by developers).

## 🎯 Benefits of Root-Level Content

### 1. **Clear Separation of Concerns**
- **Content** (`./content/`) - Markdown files, schemas, contributing guidelines
- **Code** (`./src/`) - Components, layouts, styles, logic

### 2. **Better for Non-Technical Contributors**
- Content editors don't need to navigate into `src/` folder
- Clearer mental model: "content lives at the root"
- Contributing guide (`CONTRIBUTING.md`) lives with the content

### 3. **Flexible Content Management**
- Content could be managed as a separate repository/submodule
- Content can have its own tooling without affecting code
- Easier to set up content-specific CI/CD

## 🔧 Technical Implementation

### Symlink Solution

Since Astro's content collections system expects content in `src/content` by default, we use a **symlink** to bridge the gap:

```
src/content → ../content (symlink)
```

This approach:
- ✅ Keeps actual content files at project root
- ✅ Allows Astro to find content where it expects
- ✅ Works in both dev and production builds
- ✅ Transparent to Astro - it just works!

### Directory Structure

```
microhams/
├── content/                    # 📝 Root-level content directory
│   ├── articles/              # Blog posts and tutorials
│   │   ├── getting-started-with-sdr.md
│   │   └── digital-modes-guide.md
│   ├── docs/                  # Technical documentation
│   │   └── antenna-theory-basics.md
│   ├── projects/              # Project documentation
│   │   └── raspberry-pi-aprs-gateway.md
│   ├── pages/                 # General site pages
│   │   └── about.md
│   ├── config.ts              # Content collection schemas
│   └── CONTRIBUTING.md        # Content contribution guide
│
├── src/
│   ├── content → ../content   # ⚡ Symlink to root content
│   ├── layouts/               # Astro layouts
│   ├── pages/                 # Route files
│   ├── lib/                   # Utilities
│   └── styles/                # CSS
│
└── [other project files]
```

## 📋 Files Updated

### Configuration
- ✅ **astro.config.mjs** - No changes needed (Astro auto-detects via symlink)
- ✅ **src/content** - Created symlink to `../content`

### Documentation
All documentation updated to reflect new structure:
- ✅ **README.md** - Complete rewrite with modern structure
- ✅ **docs/START_HERE.md** - Updated all `src/content` references to `content`
- ✅ **docs/PROJECT_SUMMARY.md** - Updated content directory paths
- ✅ **docs/QUICK_REFERENCE.md** - Updated example file paths
- ✅ **docs/MICROHAMS_README.md** - Updated content structure diagram
- ✅ **content/CONTRIBUTING.md** - Updated file location references

### Code
- ✅ **src/pages/*.astro** - No changes needed (use `getCollection()` which is location-agnostic)
- ✅ **content/config.ts** - No changes needed (same schemas)

## ✅ Verification

### Build Test
```bash
npm run build
```

**Result**: ✅ Success - Generated 8 pages
- 2 articles (getting-started-with-sdr, digital-modes-guide)
- 1 doc (antenna-theory-basics)
- 1 project (raspberry-pi-aprs-gateway)
- 4 index pages (articles, docs, projects, home)

### Dev Server Test
```bash
npm run dev
```

**Result**: ✅ Success - Content synced correctly
- Astro detects content via symlink
- HMR works for content changes
- No errors or warnings

## 🎓 How It Works

### 1. Symlink Creation
```bash
cd src
ln -s ../content content
```

This creates a symbolic link that points from `src/content` to the root-level `content` directory.

### 2. Astro Content Detection
- Astro scans `src/content/config.ts` (via symlink)
- Generates TypeScript types in `.astro/content.d.ts`
- References: `import("../content/config.js")` (works via symlink)

### 3. Content Collections API
Pages use `getCollection()` which:
- Reads from `src/content` (which points to `../content`)
- Returns content entries with proper types
- Works identically to before

## 📝 Content Workflows

### Adding New Content

Content files go in the **root-level** `content/` directory:

```bash
# New article
cat > content/articles/my-article.md << 'EOF'
---
title: "My Article"
description: "Description"
date: 2025-10-21
---
Content here...
EOF

# New documentation
cat > content/docs/my-doc.md << 'EOF'
---
title: "My Doc"
order: 10
---
Documentation here...
EOF

# New project
cat > content/projects/my-project.md << 'EOF'
---
title: "My Project"
status: "active"
---
Project details...
EOF
```

### Editing Content

1. Navigate to `content/` directory (at root)
2. Edit markdown files
3. Astro HMR detects changes via symlink
4. Browser updates automatically

### Content Contribution

Non-technical contributors:
1. Clone repository
2. Navigate to `content/` folder (top level, easy to find)
3. Add/edit markdown files
4. Submit pull request

No need to navigate into `src/` or understand code structure!

## 🔍 TypeScript Types

TypeScript still generates proper types because:

```typescript
// .astro/content.d.ts (auto-generated)
export type ContentConfig = typeof import("../content/config.js");
```

The relative path `../content/` works from `.astro/` whether content is at `src/content` or linked from root.

## 🐛 Troubleshooting

### Build Says "Collection does not exist"

**Cause**: Symlink not created or broken

**Solution**:
```bash
cd src
rm -f content  # Remove if exists
ln -s ../content content  # Recreate symlink
```

### Content Changes Not Detected

**Cause**: File watcher might not follow symlinks

**Solution**:
```bash
# Restart dev server
npm run dev
```

### TypeScript Errors

**Cause**: Types not regenerated

**Solution**:
```bash
# Clear Astro cache
rm -rf .astro

# Rebuild types
npm run dev
```

## 🎯 Best Practices

### Do's ✅
- ✅ Add content files to root-level `content/` directory
- ✅ Use proper front matter schemas (defined in `content/config.ts`)
- ✅ Include `CONTRIBUTING.md` in content directory
- ✅ Organize by collection type (articles, docs, projects, pages)

### Don'ts ❌
- ❌ Don't add content to `src/content` (it's a symlink!)
- ❌ Don't delete the `src/content` symlink
- ❌ Don't modify `.astro/` directory (auto-generated)
- ❌ Don't commit changes to `.astro/content.d.ts` (regenerated)

## 📊 Comparison: Before vs After

| Aspect | Before (src/content) | After (./content) |
|--------|---------------------|-------------------|
| **Content Location** | `src/content/` | `content/` (root) |
| **Contributor Access** | Navigate into src/ | Top-level folder |
| **Separation** | Mixed with code | Separate from code |
| **Git Submodule** | Difficult | Easy |
| **Content CI/CD** | Complex | Simple |
| **Astro Detection** | Native | Via symlink ✅ |
| **Build Works** | ✅ | ✅ |
| **Dev HMR Works** | ✅ | ✅ |

## 🚀 Future Possibilities

With content at the root level, you can now:

1. **Git Submodule**: Make content a separate repository
   ```bash
   git submodule add <content-repo-url> content
   ```

2. **Content-Only CI**: Deploy content changes without rebuilding code

3. **Multiple Languages**: Add locale-specific content folders
   ```
   content/
   ├── en/
   ├── es/
   └── fr/
   ```

4. **CMS Integration**: Point CMS to `content/` directory

5. **Content Versioning**: Tag content versions independently of code

## 📚 Related Documentation

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [PROJECT_SUMMARY.md](../docs/PROJECT_SUMMARY.md) - Architecture overview
- [CONTRIBUTING.md](../content/CONTRIBUTING.md) - Content contribution guide
- [START_HERE.md](../docs/START_HERE.md) - Getting started guide

## ✅ Summary

The content directory reorganization successfully:
- ✅ Moved content from `src/content` to root-level `content/`
- ✅ Created symlink for Astro compatibility
- ✅ Updated all documentation references
- ✅ Verified build and dev server work correctly
- ✅ Improved content contributor experience
- ✅ Maintained full TypeScript type safety

**No breaking changes** - everything works as before, just with better organization! 🎉

---

_Last updated: October 21, 2025_
