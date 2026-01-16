import { test, expect } from '@playwright/test';

/**
 * Event Page E2E Tests
 * 
 * Tests event display, datetime toggling, and logistics
 */

test.describe('Events', () => {
  test.describe('Events Listing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/events');
    });

    test('displays upcoming events section', async ({ page }) => {
      const heading = page.locator('main h1');
      await expect(heading).toHaveText('Events');
      
      // Should have upcoming events section
      const upcomingHeading = page.locator('h2:has-text("Upcoming Events")');
      await expect(upcomingHeading).toBeVisible();
    });

    test('event cards have interactive datetime', async ({ page }) => {
      // Find an event datetime toggle button
      const dateTimeToggle = page.locator('[data-event-datetime]').first();
      
      if (await dateTimeToggle.count() > 0) {
        await expect(dateTimeToggle).toBeVisible();
        
        // Get initial text
        const initialText = await dateTimeToggle.textContent();
        
        // Click to toggle timezone
        await dateTimeToggle.click();
        
        // Text should change (local → UTC)
        const newText = await dateTimeToggle.textContent();
        expect(newText).not.toBe(initialText);
        expect(newText).toContain('UTC');
        
        // Click again to toggle back
        await dateTimeToggle.click();
        const finalText = await dateTimeToggle.textContent();
        expect(finalText).not.toContain('UTC');
      }
    });

    test('event cards show join buttons', async ({ page }) => {
      // Upcoming events should have join buttons
      const joinInPerson = page.locator('a:has-text("Join In Person")').first();
      const joinOnline = page.locator('a:has-text("Join Online")').first();
      
      // At least one should be visible for upcoming events
      const inPersonVisible = await joinInPerson.isVisible().catch(() => false);
      const onlineVisible = await joinOnline.isVisible().catch(() => false);
      
      expect(inPersonVisible || onlineVisible).toBe(true);
    });

    test('event type badges are displayed', async ({ page }) => {
      const badge = page.locator('.badge').first();
      await expect(badge).toBeVisible();
    });
  });

  test.describe('Individual Event Page', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to a specific event
      await page.goto('/events');
      const eventLink = page.locator('a[href^="/events/"]').first();
      if (await eventLink.count() > 0) {
        await eventLink.click();
        await page.waitForLoadState('networkidle');
      }
    });

    test('displays event title', async ({ page }) => {
      // Scope to main content to avoid Astro dev toolbar h1s
      const heading = page.locator('main h1');
      await expect(heading).toBeVisible();
    });

    test('datetime toggle works on event page', async ({ page }) => {
      const dateTimeToggle = page.locator('[data-event-datetime]');
      
      if (await dateTimeToggle.count() > 0) {
        const initialText = await dateTimeToggle.textContent();
        expect(initialText).toContain('2026'); // Should show year
        
        // Toggle to UTC
        await dateTimeToggle.click();
        const utcText = await dateTimeToggle.textContent();
        expect(utcText).toContain('UTC');
        
        // Toggle back to local
        await dateTimeToggle.click();
        const localText = await dateTimeToggle.textContent();
        expect(localText).not.toContain('UTC');
      }
    });

    test('shows back link to events', async ({ page }) => {
      const backLink = page.locator('a:has-text("← Events")');
      await expect(backLink).toBeVisible();
      
      await backLink.click();
      await expect(page).toHaveURL(/\/events\/?$/);
    });

    test('displays venue/logistics section when applicable', async ({ page }) => {
      // External events (DXpeditions, etc.) have "Event Website →" link instead of venue
      const externalLink = page.locator('a:has-text("Event Website →")');
      const isExternalEvent = await externalLink.count() > 0;
      
      if (isExternalEvent) {
        // External events link out - no local venue expected
        await expect(externalLink).toBeVisible();
        return;
      }
      
      // Check for in-person section
      const locationSection = page.locator('#location');
      const inPersonHeading = page.locator('h2:has-text("In Person")');
      
      // At least one location indicator should exist
      const hasLocation = (await locationSection.count() > 0) || (await inPersonHeading.count() > 0);
      
      // Or online meeting section
      const onlineHeading = page.locator('h2:has-text("Teams Meeting"), h2:has-text("Online")');
      const hasOnline = await onlineHeading.count() > 0;
      
      // Event should have at least one attendance option
      expect(hasLocation || hasOnline).toBe(true);
    });

    test('directions details can expand', async ({ page }) => {
      const directionsDetails = page.locator('#directions-details');
      
      if (await directionsDetails.count() > 0) {
        // Click summary to expand
        await directionsDetails.locator('summary').click();
        
        // Details should be open
        await expect(directionsDetails).toHaveAttribute('open', '');
        
        // Map should be visible
        const map = directionsDetails.locator('.event-map');
        if (await map.count() > 0) {
          await expect(map).toBeVisible();
        }
      }
    });
  });

  test.describe('Homepage Featured Event', () => {
    test('displays featured event on homepage', async ({ page }) => {
      await page.goto('/');
      
      // Look for featured event section
      const featuredEvent = page.locator('.featured-event');
      
      if (await featuredEvent.count() > 0) {
        await expect(featuredEvent).toBeVisible();
        
        // Should have title
        const title = featuredEvent.locator('.featured-event__title');
        await expect(title).toBeVisible();
        
        // Should have datetime toggle
        const dateTime = featuredEvent.locator('[data-event-datetime]');
        await expect(dateTime).toBeVisible();
      }
    });

    test('featured event datetime toggles', async ({ page }) => {
      await page.goto('/');
      
      const dateTimeToggle = page.locator('.featured-event [data-event-datetime]');
      
      if (await dateTimeToggle.count() > 0) {
        const initialText = await dateTimeToggle.textContent();
        
        await dateTimeToggle.click();
        const newText = await dateTimeToggle.textContent();
        
        expect(newText).not.toBe(initialText);
      }
    });

    test('featured event links to event page', async ({ page }) => {
      await page.goto('/');
      
      const featuredEvent = page.locator('.featured-event');
      
      if (await featuredEvent.count() > 0) {
        await featuredEvent.click();
        await expect(page).toHaveURL(/\/events\//);
      }
    });
  });
});

test.describe('Event Accessibility', () => {
  test('datetime toggle is keyboard accessible', async ({ page }) => {
    await page.goto('/events');
    
    const dateTimeToggle = page.locator('[data-event-datetime]').first();
    
    if (await dateTimeToggle.count() > 0) {
      // Focus the button
      await dateTimeToggle.focus();
      
      // Press Enter to toggle
      await page.keyboard.press('Enter');
      
      const textAfterEnter = await dateTimeToggle.textContent();
      expect(textAfterEnter).toContain('UTC');
      
      // Press Space to toggle back
      await page.keyboard.press('Space');
      
      const textAfterSpace = await dateTimeToggle.textContent();
      expect(textAfterSpace).not.toContain('UTC');
    }
  });

  test('datetime toggle has accessible label', async ({ page }) => {
    await page.goto('/events');
    
    const dateTimeToggle = page.locator('[data-event-datetime]').first();
    
    if (await dateTimeToggle.count() > 0) {
      // Should have title attribute for tooltip
      await expect(dateTimeToggle).toHaveAttribute('title', 'Click to toggle timezone');
      
      // Should be a button element
      await expect(dateTimeToggle).toHaveRole('button');
    }
  });

  test('event page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/events');
    const eventLink = page.locator('a[href^="/events/"]').first();
    
    if (await eventLink.count() > 0) {
      await eventLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should have exactly one h1 (scoped to main to avoid Astro dev toolbar)
      const h1Count = await page.locator('main h1').count();
      expect(h1Count).toBe(1);
      
      // h2s should come after h1
      const h2s = page.locator('h2');
      const h2Count = await h2s.count();
      expect(h2Count).toBeGreaterThan(0);
    }
  });
});
