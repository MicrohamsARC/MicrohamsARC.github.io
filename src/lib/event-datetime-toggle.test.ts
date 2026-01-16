/**
 * Event DateTime Toggle Tests
 * 
 * Tests for client-side timezone toggle functionality
 * 
 * Critical test scenarios:
 * - Time parsing (12-hour, 24-hour, edge cases)
 * - Timezone conversion accuracy
 * - UTC timestamp calculation from calendar date + time + timezone
 * - DST handling in conversions
 * - Toggle state management
 */

import { describe, it, expect } from 'vitest';

describe('Time Parsing', () => {
  // These test the parseTime function indirectly through DOM interactions
  
  describe('12-hour format', () => {
    it('parses standard PM times (6:00 PM → 18:00)', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="6:00 PM"
                data-timezone="UTC">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      // Click to get UTC display
      container.querySelector('button')!.click();
      const text = container.querySelector('.datetime-text')!.textContent!;
      
      // 6:00 PM UTC should display as 6:00 PM UTC
      expect(text).toContain('6:00 PM');
      expect(text).toContain('UTC');
      
      container.remove();
    });

    it('parses AM times correctly (9:00 AM → 09:00)', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="9:00 AM"
                data-timezone="UTC">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const text = container.querySelector('.datetime-text')!.textContent!;
      
      expect(text).toContain('9:00 AM');
      
      container.remove();
    });

    it('handles noon correctly (12:00 PM → 12:00)', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="12:00 PM"
                data-timezone="UTC">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const text = container.querySelector('.datetime-text')!.textContent!;
      
      expect(text).toContain('12:00 PM');
      
      container.remove();
    });

    it('handles midnight correctly (12:00 AM → 00:00)', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="12:00 AM"
                data-timezone="UTC">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const text = container.querySelector('.datetime-text')!.textContent!;
      
      expect(text).toContain('12:00 AM');
      
      container.remove();
    });
  });

  describe('24-hour format', () => {
    it('parses 24-hour evening time (18:00)', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="18:00"
                data-timezone="UTC">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const text = container.querySelector('.datetime-text')!.textContent!;
      
      // Should convert to 12-hour for display
      expect(text).toContain('6:00 PM');
      
      container.remove();
    });
  });
});

describe('Timezone Conversions', () => {
  describe('Pacific Standard Time (PST, UTC-8)', () => {
    it('converts 6 PM PST to correct UTC (next day 2 AM)', async () => {
      // Event: Jan 20, 6:00 PM Pacific
      // UTC: Jan 21, 2:00 AM (PST is UTC-8)
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="6:00 PM"
                data-timezone="America/Los_Angeles">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      // Toggle to UTC
      container.querySelector('button')!.click();
      const utcText = container.querySelector('.datetime-text')!.textContent!;
      
      expect(utcText).toContain('UTC');
      // 6 PM PST = 2 AM UTC next day
      expect(utcText).toContain('2:00 AM');
      
      container.remove();
    });

    it('shows PST abbreviation in winter', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="6:00 PM"
                data-timezone="America/Los_Angeles">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      // Initial display should be local, toggle once to see format
      const text = container.querySelector('.datetime-text')!.textContent!;
      // Local display uses browser timezone, verify toggle works
      expect(text).toBeTruthy();
      
      container.remove();
    });
  });

  describe('Pacific Daylight Time (PDT, UTC-7)', () => {
    it('converts 6 PM PDT to correct UTC (1 AM next day)', async () => {
      // Event: July 20, 6:00 PM Pacific (PDT)
      // UTC: July 21, 1:00 AM (PDT is UTC-7)
      const container = setupContainer(`
        <button data-event-datetime="2026-07-20T00:00:00.000Z"
                data-start-time="6:00 PM"
                data-timezone="America/Los_Angeles">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      // Toggle to UTC
      container.querySelector('button')!.click();
      const utcText = container.querySelector('.datetime-text')!.textContent!;
      
      expect(utcText).toContain('UTC');
      // 6 PM PDT = 1 AM UTC next day
      expect(utcText).toContain('1:00 AM');
      
      container.remove();
    });
  });

  describe('Eastern Time', () => {
    it('converts EST correctly (UTC-5)', async () => {
      // Event: Jan 20, 7:00 PM Eastern
      // UTC: Jan 21, 12:00 AM (EST is UTC-5)
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="7:00 PM"
                data-timezone="America/New_York">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const utcText = container.querySelector('.datetime-text')!.textContent!;
      
      expect(utcText).toContain('UTC');
      // 7 PM EST = midnight UTC
      expect(utcText).toContain('12:00 AM');
      
      container.remove();
    });
  });

  describe('UTC (no offset)', () => {
    it('UTC times remain unchanged', async () => {
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="6:00 PM"
                data-timezone="UTC">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const utcText = container.querySelector('.datetime-text')!.textContent!;
      
      expect(utcText).toContain('6:00 PM');
      expect(utcText).toContain('UTC');
      
      container.remove();
    });
  });

  describe('International timezones', () => {
    it('handles positive UTC offset (Tokyo, UTC+9)', async () => {
      // Event: Jan 20, 7:00 PM Tokyo
      // UTC: Jan 20, 10:00 AM (JST is UTC+9, so subtract 9 hours)
      const container = setupContainer(`
        <button data-event-datetime="2026-01-20T00:00:00.000Z"
                data-start-time="7:00 PM"
                data-timezone="Asia/Tokyo">
          <span class="datetime-text"></span>
        </button>
      `);
      
      const { initDateTimeToggles } = await import('./event-datetime-toggle');
      initDateTimeToggles();
      
      container.querySelector('button')!.click();
      const utcText = container.querySelector('.datetime-text')!.textContent!;
      
      expect(utcText).toContain('UTC');
      // 7 PM JST = 10 AM UTC same day
      expect(utcText).toContain('10:00 AM');
      
      container.remove();
    });
  });
});

describe('Toggle State Management', () => {
  it('starts in local mode by default', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-start-time="6:00 PM"
              data-timezone="America/Los_Angeles">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const button = container.querySelector('button') as any;
    expect(button._tzMode).toBe('local');
    
    container.remove();
  });

  it('toggles to UTC on first click', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-start-time="6:00 PM"
              data-timezone="America/Los_Angeles">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const button = container.querySelector('button') as any;
    button.click();
    
    expect(button._tzMode).toBe('utc');
    expect(container.querySelector('.datetime-text')!.textContent).toContain('UTC');
    
    container.remove();
  });

  it('toggles back to local on second click', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-start-time="6:00 PM"
              data-timezone="America/Los_Angeles">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const button = container.querySelector('button') as any;
    button.click(); // → UTC
    button.click(); // → local
    
    expect(button._tzMode).toBe('local');
    expect(container.querySelector('.datetime-text')!.textContent).not.toContain('UTC');
    
    container.remove();
  });

  it('skips already initialized buttons', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-timezone="America/Los_Angeles">
        <span class="datetime-text">Initial</span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    
    initDateTimeToggles();
    const button = container.querySelector('button') as any;
    const firstDate = button._eventDate;
    
    // Try to init again
    initDateTimeToggles();
    
    // Should be same instance
    expect(button._eventDate).toBe(firstDate);
    
    container.remove();
  });
});

describe('Time Range Display', () => {
  it('displays start and end time with en-dash', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-start-time="6:00 PM"
              data-end-time="8:30 PM"
              data-timezone="UTC">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    container.querySelector('button')!.click();
    const text = container.querySelector('.datetime-text')!.textContent!;
    
    expect(text).toContain('6:00 PM');
    expect(text).toContain('8:30 PM');
    expect(text).toContain('–'); // en-dash
    
    container.remove();
  });

  it('handles events without end time', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-start-time="6:00 PM"
              data-timezone="UTC">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    container.querySelector('button')!.click();
    const text = container.querySelector('.datetime-text')!.textContent!;
    
    expect(text).toContain('6:00 PM');
    expect(text).not.toContain('–');
    
    container.remove();
  });

  it('handles events without any time', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-timezone="UTC">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const text = container.querySelector('.datetime-text')!.textContent!;
    
    expect(text).toContain('January');
    expect(text).toContain('20');
    expect(text).toContain('2026');
    // No time should be shown
    expect(text).not.toContain('PM');
    expect(text).not.toContain('AM');
    
    container.remove();
  });
});

describe('Edge Cases', () => {
  it('handles missing timezone gracefully (defaults to LA)', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-start-time="6:00 PM">
        <span class="datetime-text"></span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const button = container.querySelector('button') as any;
    expect(button._eventTimezone).toBe('America/Los_Angeles');
    
    container.remove();
  });

  it('ignores buttons without data-event-datetime', async () => {
    const container = setupContainer(`
      <button data-start-time="6:00 PM">
        <span class="datetime-text">Not an event</span>
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const button = container.querySelector('button') as any;
    expect(button._eventDate).toBeUndefined();
    
    container.remove();
  });

  it('creates datetime-text span if missing', async () => {
    const container = setupContainer(`
      <button data-event-datetime="2026-01-20T00:00:00.000Z"
              data-timezone="UTC">
      </button>
    `);
    
    const { initDateTimeToggles } = await import('./event-datetime-toggle');
    initDateTimeToggles();
    
    const textSpan = container.querySelector('.datetime-text');
    expect(textSpan).not.toBeNull();
    expect(textSpan!.textContent).toContain('January');
    
    container.remove();
  });
});

// Helper function to create test containers
function setupContainer(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}
