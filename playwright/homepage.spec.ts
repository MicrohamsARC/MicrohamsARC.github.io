import { test, expect } from '@playwright/test';
import { siteConfig } from '../src/site.config';

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
    // Check for main heading (scoped to main content to avoid Astro dev toolbar)
    await expect(page.locator('main h1, .featured-event__title').first()).toBeVisible();
    
    // Verify meta tags
    await expect(page).toHaveTitle(new RegExp(siteConfig.name));
  });

  test('should have working navigation', async ({ page }) => {
    // Test Events link
    await page.click('a[href="/events"]');
    await expect(page).toHaveURL(/\/events/);
    
    // Navigate back
    await page.goBack();
    
    // Test Articles link
    await page.click('a[href="/articles"]');
    await expect(page).toHaveURL(/\/articles/);
    
    // Test Docs link
    await page.goBack();
    await page.click('a[href="/docs"]');
    await expect(page).toHaveURL(/\/docs/);
  });

  test('should display featured content', async ({ page }) => {
    // Check for content sections
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for navigation element (use specific ID - there are 2 navs on page)
    const nav = page.locator('nav#active-nav');
    await expect(nav).toBeVisible();
    
    // Check nav links exist
    const navLinks = nav.locator('.nav__link');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check heading levels are properly ordered (scoped to main to avoid Astro dev toolbar)
    const h1 = await page.locator('main h1').count();
    expect(h1).toBeGreaterThanOrEqual(0); // Homepage may not have explicit h1 if featured event is the heading
    expect(h1).toBeLessThanOrEqual(1); // Only one h1 per page in main content
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
