import { test, expect } from '@playwright/test';

/**
 * Homepage E2E Tests
 * 
 * Tests core functionality and navigation
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('h1')).toContainText('MicroHAMS');
    
    // Verify meta tags
    await expect(page).toHaveTitle(/MicroHAMS/);
  });

  test('should have working navigation', async ({ page }) => {
    // Test Articles link
    await page.click('text=Articles');
    await expect(page).toHaveURL(/\/articles/);
    await expect(page.locator('h1')).toContainText('Articles');
    
    // Navigate back
    await page.goBack();
    
    // Test Docs link
    await page.click('text=Docs');
    await expect(page).toHaveURL(/\/docs/);
    
    // Test Projects link
    await page.goBack();
    await page.click('text=Projects');
    await expect(page).toHaveURL(/\/projects/);
  });

  test('should display featured content', async ({ page }) => {
    // Check for article cards
    const cards = page.locator('.card');
    await expect(cards.first()).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for proper ARIA labels
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Verify keyboard navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check heading levels are properly ordered
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);
    expect(h1).toBeLessThanOrEqual(1); // Only one h1 per page
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate around the site
    await page.click('text=Articles');
    await page.goBack();
    
    // Should have no console errors
    expect(errors).toHaveLength(0);
  });
});
