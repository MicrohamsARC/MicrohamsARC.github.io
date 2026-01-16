/**
 * Event Time Utilities Tests
 * 
 * Tests for timezone-aware date/time formatting
 * 
 * Critical test scenarios:
 * - Events in different timezones (Pacific, Eastern, UTC, international)
 * - DST transitions (spring forward, fall back)
 * - Edge times (midnight, noon, day boundaries)
 * - Calendar date preservation across timezone conversions
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getEventTimezone,
  getTimezoneAbbreviation,
  formatEventDate,
  formatEventTime,
  formatEventDateTime,
  formatEventDateTimeLine,
} from './event-time';

// Mock site.config with test venues in different timezones
// This mirrors the structure in site.config.ts but with test-specific venues
vi.mock('../site.config', () => ({
  siteConfig: {
    name: 'MicroHAMS',
    timezone: 'America/Los_Angeles',
    locale: 'en-US',
  },
  dateTimeFormats: {
    dateLong: {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
    dateShort: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
    dateCompact: {
      month: 'short',
      day: 'numeric',
    },
    time: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
    timeWithZone: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    },
    dateTimeLong: {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  },
  getVenueTimezone: (venue?: string) => {
    const venueTimezones: Record<string, string> = {
      'building-31': 'America/Los_Angeles',      // Pacific
      'nyc-venue': 'America/New_York',           // Eastern  
      'london-venue': 'Europe/London',           // GMT/BST
      'tokyo-venue': 'Asia/Tokyo',               // JST (no DST)
      'sydney-venue': 'Australia/Sydney',        // AEDT/AEST (southern hemisphere DST)
      'utc-venue': 'UTC',
    };
    return venueTimezones[venue || ''] || 'America/Los_Angeles';
  },
}));

describe('getEventTimezone', () => {
  it('returns explicit timezone when provided', () => {
    const result = getEventTimezone('building-31', 'America/New_York');
    expect(result).toBe('America/New_York');
  });

  it('derives timezone from venue when no explicit timezone', () => {
    expect(getEventTimezone('building-31')).toBe('America/Los_Angeles');
    expect(getEventTimezone('nyc-venue')).toBe('America/New_York');
    expect(getEventTimezone('tokyo-venue')).toBe('Asia/Tokyo');
  });

  it('returns site default when no venue or timezone', () => {
    const result = getEventTimezone();
    expect(result).toBe('America/Los_Angeles');
  });

  it('handles unknown venue gracefully', () => {
    const result = getEventTimezone('unknown-venue');
    expect(result).toBe('America/Los_Angeles'); // Falls back to default
  });
});

describe('getTimezoneAbbreviation', () => {
  describe('US Pacific timezone', () => {
    it('returns PST in winter (standard time)', () => {
      // January - definitely PST
      const winterDate = new Date('2026-01-15T12:00:00Z');
      expect(getTimezoneAbbreviation(winterDate, 'America/Los_Angeles')).toBe('PST');
    });

    it('returns PDT in summer (daylight time)', () => {
      // July - definitely PDT
      const summerDate = new Date('2026-07-15T12:00:00Z');
      expect(getTimezoneAbbreviation(summerDate, 'America/Los_Angeles')).toBe('PDT');
    });

    it('handles spring DST transition correctly', () => {
      // 2026: DST starts March 8 at 2:00 AM local
      const beforeDST = new Date('2026-03-08T09:00:00Z'); // 1 AM PST
      const afterDST = new Date('2026-03-08T11:00:00Z');  // 4 AM PDT
      
      expect(getTimezoneAbbreviation(beforeDST, 'America/Los_Angeles')).toBe('PST');
      expect(getTimezoneAbbreviation(afterDST, 'America/Los_Angeles')).toBe('PDT');
    });

    it('handles fall DST transition correctly', () => {
      // 2026: DST ends November 1 at 2:00 AM local
      const beforeFallback = new Date('2026-11-01T08:00:00Z'); // 1 AM PDT
      const afterFallback = new Date('2026-11-01T10:00:00Z');  // 2 AM PST
      
      expect(getTimezoneAbbreviation(beforeFallback, 'America/Los_Angeles')).toBe('PDT');
      expect(getTimezoneAbbreviation(afterFallback, 'America/Los_Angeles')).toBe('PST');
    });
  });

  describe('US Eastern timezone', () => {
    it('returns EST in winter', () => {
      const winterDate = new Date('2026-01-15T12:00:00Z');
      expect(getTimezoneAbbreviation(winterDate, 'America/New_York')).toBe('EST');
    });

    it('returns EDT in summer', () => {
      const summerDate = new Date('2026-07-15T12:00:00Z');
      expect(getTimezoneAbbreviation(summerDate, 'America/New_York')).toBe('EDT');
    });
  });

  describe('International timezones', () => {
    it('returns UTC for UTC timezone', () => {
      const date = new Date('2026-01-20T00:00:00Z');
      expect(getTimezoneAbbreviation(date, 'UTC')).toBe('UTC');
    });

    it('handles Tokyo (no DST)', () => {
      // Japan doesn't observe DST - same offset year-round
      // ICU may return 'JST' or 'GMT+9' depending on ICU data
      const winter = new Date('2026-01-15T12:00:00Z');
      const summer = new Date('2026-07-15T12:00:00Z');
      
      const winterAbbr = getTimezoneAbbreviation(winter, 'Asia/Tokyo');
      const summerAbbr = getTimezoneAbbreviation(summer, 'Asia/Tokyo');
      
      expect(winterAbbr === 'JST' || winterAbbr === 'GMT+9').toBe(true);
      expect(summerAbbr === 'JST' || summerAbbr === 'GMT+9').toBe(true);
      // Both should be same (no DST)
      expect(winterAbbr).toBe(summerAbbr);
    });

    it('handles London (GMT/BST)', () => {
      // ICU may return named abbreviations or GMT offset
      const winter = new Date('2026-01-15T12:00:00Z');
      const summer = new Date('2026-07-15T12:00:00Z');
      
      const winterAbbr = getTimezoneAbbreviation(winter, 'Europe/London');
      const summerAbbr = getTimezoneAbbreviation(summer, 'Europe/London');
      
      // Winter: GMT (UTC+0)
      expect(winterAbbr === 'GMT' || winterAbbr === 'UTC').toBe(true);
      // Summer: BST (UTC+1)
      expect(summerAbbr === 'BST' || summerAbbr === 'GMT+1').toBe(true);
      // Verify DST difference
      expect(winterAbbr).not.toBe(summerAbbr);
    });

    it('handles Sydney (southern hemisphere DST)', () => {
      // Australia has opposite DST - summer in Dec/Jan
      // ICU may return AEDT/AEST or GMT+11/GMT+10
      const janDate = new Date('2026-01-15T12:00:00Z'); // Australian summer
      const julDate = new Date('2026-07-15T12:00:00Z'); // Australian winter
      
      const summerAbbr = getTimezoneAbbreviation(janDate, 'Australia/Sydney');
      const winterAbbr = getTimezoneAbbreviation(julDate, 'Australia/Sydney');
      
      // Summer (Jan): AEDT = UTC+11
      expect(summerAbbr === 'AEDT' || summerAbbr === 'GMT+11').toBe(true);
      // Winter (Jul): AEST = UTC+10
      expect(winterAbbr === 'AEST' || winterAbbr === 'GMT+10').toBe(true);
      // Verify DST difference
      expect(summerAbbr).not.toBe(winterAbbr);
    });
  });

  it('handles invalid timezone gracefully', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    expect(getTimezoneAbbreviation(date, 'Invalid/Timezone')).toBe('');
  });
});

describe('formatEventDate', () => {
  describe('calendar date preservation', () => {
    it('preserves calendar date for Pacific timezone event', () => {
      // Event on Jan 20 stored as UTC midnight
      const date = new Date('2026-01-20T00:00:00Z');
      const result = formatEventDate(date, { timezone: 'America/Los_Angeles' });
      
      expect(result).toContain('January');
      expect(result).toContain('20');
      expect(result).toContain('2026');
      expect(result).toContain('Tuesday');
    });

    it('preserves calendar date for Eastern timezone event', () => {
      const date = new Date('2026-01-20T00:00:00Z');
      const result = formatEventDate(date, { timezone: 'America/New_York' });
      
      // Should still show Jan 20, not Jan 19
      expect(result).toContain('20');
    });

    it('preserves calendar date for Tokyo event', () => {
      const date = new Date('2026-01-20T00:00:00Z');
      const result = formatEventDate(date, { timezone: 'Asia/Tokyo' });
      
      // Should still show Jan 20, even though Tokyo is +9
      expect(result).toContain('20');
    });

    it('preserves date across all major timezones', () => {
      const date = new Date('2026-06-15T00:00:00Z'); // June 15
      const timezones = [
        'America/Los_Angeles',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney',
        'UTC',
      ];

      for (const tz of timezones) {
        const result = formatEventDate(date, { timezone: tz });
        expect(result).toContain('15'); // All should show 15th
      }
    });
  });

  describe('format options', () => {
    it('formats date in long format by default', () => {
      const date = new Date('2026-01-20T00:00:00Z');
      const result = formatEventDate(date);
      
      expect(result).toContain('January'); // Full month name
      expect(result).toContain('Tuesday'); // Full weekday
    });

    it('formats date in short format', () => {
      const date = new Date('2026-01-20T00:00:00Z');
      const result = formatEventDate(date, { format: 'short' });
      
      expect(result).toContain('Jan'); // Abbreviated month
      expect(result).toContain('20');  // Day
      expect(result).toContain('2026'); // Year
      // Short format doesn't include weekday (by design)
    });
  });

  describe('edge dates', () => {
    it('handles New Year boundary correctly', () => {
      const dec31 = new Date('2025-12-31T00:00:00Z');
      const jan1 = new Date('2026-01-01T00:00:00Z');
      
      expect(formatEventDate(dec31)).toContain('December');
      expect(formatEventDate(dec31)).toContain('31');
      expect(formatEventDate(dec31)).toContain('2025');
      
      expect(formatEventDate(jan1)).toContain('January');
      expect(formatEventDate(jan1)).toContain('1');
      expect(formatEventDate(jan1)).toContain('2026');
    });

    it('handles leap year date correctly', () => {
      // 2028 is a leap year
      const leapDay = new Date('2028-02-29T00:00:00Z');
      const result = formatEventDate(leapDay);
      
      expect(result).toContain('February');
      expect(result).toContain('29');
    });
  });
});

describe('formatEventTime', () => {
  describe('basic formatting', () => {
    it('returns empty string when no start time', () => {
      expect(formatEventTime()).toBe('');
      expect(formatEventTime(undefined)).toBe('');
    });

    it('formats single time with timezone abbreviation', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('6:00 PM', undefined, { 
        eventDate,
        timezone: 'America/Los_Angeles',
      });
      
      expect(result).toContain('6:00 PM');
      expect(result).toContain('PST');
    });

    it('formats time range with en-dash', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('6:00 PM', '8:30 PM', { 
        eventDate,
        timezone: 'America/Los_Angeles',
      });
      
      expect(result).toBe('6:00 PM–8:30 PM PST');
    });
  });

  describe('timezone-specific formatting', () => {
    it('shows PST for Pacific winter event', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('6:00 PM', undefined, { 
        eventDate,
        venue: 'building-31',
      });
      
      expect(result).toContain('PST');
    });

    it('shows PDT for Pacific summer event', () => {
      const eventDate = new Date('2026-07-20T00:00:00Z');
      const result = formatEventTime('6:00 PM', undefined, { 
        eventDate,
        venue: 'building-31',
      });
      
      expect(result).toContain('PDT');
    });

    it('shows EST for Eastern winter event', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('7:00 PM', undefined, { 
        eventDate,
        venue: 'nyc-venue',
      });
      
      expect(result).toContain('EST');
    });

    it('shows consistent timezone for Tokyo event (no DST variation)', () => {
      const winter = new Date('2026-01-20T00:00:00Z');
      const summer = new Date('2026-07-20T00:00:00Z');
      
      const winterResult = formatEventTime('19:00', undefined, { 
        eventDate: winter, venue: 'tokyo-venue' 
      });
      const summerResult = formatEventTime('19:00', undefined, { 
        eventDate: summer, venue: 'tokyo-venue' 
      });
      
      // ICU may return JST or GMT+9
      expect(winterResult).toMatch(/JST|GMT\+9/);
      expect(summerResult).toMatch(/JST|GMT\+9/);
      // Same timezone year-round (no DST in Japan)
      expect(winterResult).toBe(summerResult);
    });
  });

  describe('edge times', () => {
    it('handles midnight correctly', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('12:00 AM', undefined, { eventDate });
      
      expect(result).toContain('12:00 AM');
    });

    it('handles noon correctly', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('12:00 PM', undefined, { eventDate });
      
      expect(result).toContain('12:00 PM');
    });

    it('handles events spanning midnight', () => {
      const eventDate = new Date('2026-01-20T00:00:00Z');
      const result = formatEventTime('10:00 PM', '2:00 AM', { eventDate });
      
      expect(result).toContain('10:00 PM');
      expect(result).toContain('2:00 AM');
    });
  });
});

describe('formatEventDateTime', () => {
  it('returns complete event datetime info', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    const result = formatEventDateTime(date, {
      startTime: '6:00 PM',
      endTime: '8:30 PM',
      venue: 'building-31',
    });

    expect(result.date).toContain('January');
    expect(result.date).toContain('20');
    expect(result.time).toContain('6:00 PM');
    expect(result.time).toContain('8:30 PM');
    expect(result.timezone).toBe('America/Los_Angeles');
  });

  it('handles event without times', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    const result = formatEventDateTime(date, { venue: 'building-31' });

    expect(result.date).toContain('January');
    expect(result.time).toBe('');
    expect(result.timezone).toBe('America/Los_Angeles');
  });

  it('uses correct timezone for different venues', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    
    expect(formatEventDateTime(date, { venue: 'building-31' }).timezone)
      .toBe('America/Los_Angeles');
    expect(formatEventDateTime(date, { venue: 'nyc-venue' }).timezone)
      .toBe('America/New_York');
    expect(formatEventDateTime(date, { venue: 'tokyo-venue' }).timezone)
      .toBe('Asia/Tokyo');
  });
});

describe('formatEventDateTimeLine', () => {
  it('formats compact date/time for cards', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    const result = formatEventDateTimeLine(date, {
      startTime: '6:00 PM',
      endTime: '8:30 PM',
      venue: 'building-31',
    });

    expect(result).toContain('Jan');
    expect(result).toContain('20');
    expect(result).toContain('·');
    expect(result).toContain('6:00 PM');
    expect(result).toContain('8:30 PM');
    expect(result).toContain('PST');
  });

  it('returns only date when no time', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    const result = formatEventDateTimeLine(date);

    expect(result).toBe('Jan 20');
    expect(result).not.toContain('·');
  });

  it('shows correct DST abbreviation by date', () => {
    const winterDate = new Date('2026-01-20T00:00:00Z');
    const summerDate = new Date('2026-07-20T00:00:00Z');
    
    expect(formatEventDateTimeLine(winterDate, {
      startTime: '6:00 PM',
      venue: 'building-31',
    })).toContain('PST');
    
    expect(formatEventDateTimeLine(summerDate, {
      startTime: '6:00 PM',
      venue: 'building-31',
    })).toContain('PDT');
  });
});

describe('Real-world scenarios', () => {
  it('MicroHAMS January meeting - Building 31, Pacific', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    const result = formatEventDateTime(date, {
      startTime: '6:00 PM',
      endTime: '8:30 PM',
      venue: 'building-31',
    });

    expect(result.date).toBe('Tuesday, January 20, 2026');
    expect(result.time).toBe('6:00 PM–8:30 PM PST');
    expect(result.timezone).toBe('America/Los_Angeles');
  });

  it('Summer field day - Pacific daylight time', () => {
    const date = new Date('2026-06-27T00:00:00Z'); // Field Day weekend
    const result = formatEventDateTime(date, {
      startTime: '11:00 AM',
      endTime: '11:00 PM',
      venue: 'building-31',
    });

    expect(result.date).toContain('June');
    expect(result.date).toContain('27');
    expect(result.time).toContain('PDT'); // Summer = PDT
  });

  it('Event at NYC venue shows Eastern time', () => {
    const date = new Date('2026-03-15T00:00:00Z');
    const result = formatEventDateTime(date, {
      startTime: '7:00 PM',
      venue: 'nyc-venue',
    });

    expect(result.timezone).toBe('America/New_York');
    // March 15 is after DST starts (March 8)
    expect(result.time).toContain('EDT');
  });

  it('International event shows correct local timezone', () => {
    const date = new Date('2026-04-15T00:00:00Z');
    
    const tokyoResult = formatEventDateTime(date, {
      startTime: '19:00',
      venue: 'tokyo-venue',
    });
    // ICU may return JST or GMT+9
    expect(tokyoResult.time).toMatch(/JST|GMT\+9/);

    const londonResult = formatEventDateTime(date, {
      startTime: '7:00 PM',
      venue: 'london-venue',
    });
    // April = British Summer Time (BST or GMT+1)
    expect(londonResult.time).toMatch(/BST|GMT\+1/);
  });
});

