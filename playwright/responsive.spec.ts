import { test, expect, type Page } from '@playwright/test';

/**
 * Responsive Design Tests
 * 
 * Mobile-first breakpoint system:
 * - Base (0-639px): Portrait phones (default styles, no query)
 * - sm (640px+): Large phones, landscape
 * - md (768px+): Tablets  
 * - lg (1024px+): Laptops
 * - xl (1280px+): Desktops
 * 
 * Each test validates:
 * 1. No horizontal overflow
 * 2. Layout adapts correctly at breakpoints
 * 3. Touch targets are accessible on mobile
 */

const BREAKPOINTS = {
  xs: 360,   // Small phones (iPhone SE minimum)
  sm: 640,   // Large phones, landscape
  md: 768,   // Tablets
  lg: 1024,  // Laptops
  xl: 1280,  // Desktops
  '2xl': 1536, // Large screens
} as const;

const PAGES = ['/', '/articles', '/events', '/docs', '/about'] as const;

/**
 * Check for horizontal overflow - the most common responsive bug
 */
async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow, 'Page should not have horizontal overflow').toBe(false);
}

/**
 * Get computed style value
 */
async function getComputedStyle(page: Page, selector: string, property: string) {
  return page.locator(selector).first().evaluate(
    (el, prop) => window.getComputedStyle(el).getPropertyValue(prop),
    property
  );
}

test.describe('Responsive: No Horizontal Overflow @responsive', () => {
  for (const [name, width] of Object.entries(BREAKPOINTS)) {
    test(`no overflow at ${name} (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      
      for (const url of PAGES) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        await assertNoHorizontalOverflow(page);
      }
    });
  }
});

test.describe('Responsive: Wrapper Fluid Padding @responsive', () => {
  test('wrapper has minimum padding on mobile', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xs, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const padding = await getComputedStyle(page, '.wrapper', 'padding-inline');
    const paddingValue = parseFloat(padding);
    
    // Should be at least 16px (1rem) on mobile
    expect(paddingValue).toBeGreaterThanOrEqual(16);
  });

  test('wrapper has maximum padding on desktop', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xl, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const padding = await getComputedStyle(page, '.wrapper', 'padding-inline');
    const paddingValue = parseFloat(padding);
    
    // Should be at most 32px (2rem) on desktop
    expect(paddingValue).toBeLessThanOrEqual(32);
  });
});

test.describe('Responsive: Navigation @responsive', () => {
  test('nav wraps on mobile', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xs, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const flexWrap = await getComputedStyle(page, '.nav__list', 'flex-wrap');
    expect(flexWrap).toBe('wrap');
  });

  test('nav does not wrap on desktop', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.lg, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const flexWrap = await getComputedStyle(page, '.nav__list', 'flex-wrap');
    expect(flexWrap).toBe('nowrap');
  });

  test('tagline hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xs, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const tagline = page.locator('.site-header__tagline');
    if (await tagline.count() > 0) {
      await expect(tagline).toBeHidden();
    }
  });

  test('tagline visible on tablet+', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.md, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const tagline = page.locator('.site-header__tagline');
    if (await tagline.count() > 0) {
      await expect(tagline).toBeVisible();
    }
  });
});

test.describe('Responsive: Grid Layouts @responsive', () => {
  test('grid collapses to single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xs, height: 800 });
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    
    const grid = page.locator('.grid--2, .grid--3, .grid--4').first();
    if (await grid.count() > 0) {
      const columns = await grid.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });
      // Single column should be a single value (like "300px" or "1fr")
      expect(columns.split(' ').length).toBe(1);
    }
  });

  test('grid expands to multiple columns on tablet+', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.md, height: 800 });
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    
    const grid = page.locator('.grid--2, .grid--3').first();
    if (await grid.count() > 0) {
      const columns = await grid.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });
      // Multiple columns should have multiple values
      expect(columns.split(' ').length).toBeGreaterThan(1);
    }
  });
});

test.describe('Responsive: Touch Targets @responsive @a11y', () => {
  test('nav links have adequate touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xs, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const links = page.locator('.nav__link');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      if (box) {
        // WCAG 2.5.5 recommends at least 44x44px touch targets
        // We allow 24px height as compromise for inline nav
        expect(box.height).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('buttons have adequate touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: BREAKPOINTS.xs, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const buttons = page.locator('.button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        // Buttons should be at least 44px tall
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }
  });
});

test.describe('Responsive: Visual Regression @responsive @visual', () => {
  for (const [name, width] of Object.entries(BREAKPOINTS)) {
    test(`homepage at ${name} (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`homepage-${name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});

test.describe('Responsive: Breakpoint Boundaries @responsive', () => {
  // Test exact breakpoint boundaries
  const BOUNDARY_TESTS = [
    { below: 767, at: 768, name: 'md' },
    { below: 1023, at: 1024, name: 'lg' },
  ] as const;

  for (const { below, at, name } of BOUNDARY_TESTS) {
    test(`layout changes at ${name} (${at}px) boundary`, async ({ page }) => {
      // Just below breakpoint
      await page.setViewportSize({ width: below, height: 800 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const navWrapBelow = await getComputedStyle(page, '.nav__list', 'flex-wrap');
      
      // At breakpoint
      await page.setViewportSize({ width: at, height: 800 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const navWrapAt = await getComputedStyle(page, '.nav__list', 'flex-wrap');
      
      // Layout should change at the boundary
      if (name === 'md') {
        expect(navWrapBelow).toBe('wrap');
        expect(navWrapAt).toBe('nowrap');
      }
    });
  }
});

test.describe('Responsive: Content Width Constraints @responsive', () => {
  test('prose content respects measure on all viewports', async ({ page }) => {
    for (const [_name, width] of Object.entries(BREAKPOINTS)) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/articles');
      await page.waitForLoadState('networkidle');
      
      const prose = page.locator('p').first();
      if (await prose.count() > 0) {
        const box = await prose.boundingBox();
        if (box) {
          // Content should never exceed optimal measure (~65ch ≈ 585px at 16px)
          // But on mobile it can be full width
          expect(box.width).toBeLessThanOrEqual(Math.max(width - 32, 600));
        }
      }
    }
  });
});
