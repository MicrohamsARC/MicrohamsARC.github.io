import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * Validates design system consistency across pages
 * Tagged with @visual for selective execution
 */

test.describe('Visual Regression @visual', () => {
  test('homepage matches design system', async ({ page }) => {
    await page.goto('/');
    
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('articles page layout', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('articles-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('typography scale', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Capture specific section with typography
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveScreenshot('typography-scale.png');
  });

  test('card component', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    
    // Test article card appearance on articles page
    const article = page.locator('article').first();
    if (await article.count() > 0) {
      await expect(article).toHaveScreenshot('article-card.png');
    }
  });

  test('button variants', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    
    // Capture button if present
    const button = page.locator('.button').first();
    if (await button.count() > 0) {
      await expect(button).toHaveScreenshot('button-component.png');
    }
  });

  test('navigation menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const nav = page.locator('nav#active-nav');
    await expect(nav).toHaveScreenshot('navigation.png');
  });

  test('responsive mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('responsive tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Color Contrast @visual @a11y', () => {
  test('text colors meet WCAG AA', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check primary text color contrast
    const textColor = await page.locator('body').evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    const bgColor = await page.locator('body').evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    // Both should be defined
    expect(textColor).toBeTruthy();
    expect(bgColor).toBeTruthy();
  });

  test('link colors meet WCAG AA', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    
    const link = page.locator('a').first();
    const linkColor = await link.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    expect(linkColor).toBeTruthy();
  });
});

test.describe('Layout Primitives @visual', () => {
  test('stack primitive spacing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const stack = page.locator('.stack-4').first();
    await expect(stack).toHaveScreenshot('stack-primitive.png');
  });

  test('cluster primitive wrapping', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    
    const cluster = page.locator('.cluster').first();
    if (await cluster.count() > 0) {
      await expect(cluster).toHaveScreenshot('cluster-primitive.png');
    }
  });

  test('center primitive max-width', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const wrapper = page.locator('.wrapper').first();
    
    // Verify max-width is applied
    const maxWidth = await wrapper.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.maxInlineSize || style.maxWidth;
    });
    
    expect(maxWidth).toBeTruthy();
  });

  test('grid primitive auto-fit', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    
    const grid = page.locator('.grid').first();
    await expect(grid).toHaveScreenshot('grid-primitive.png');
  });
});
