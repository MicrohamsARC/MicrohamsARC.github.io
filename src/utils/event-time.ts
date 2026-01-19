/**
 * Event Time Utilities
 *
 * Handles timezone-aware date/time formatting for events.
 * Design principles:
 * - eventDate is a calendar date (not a UTC timestamp)
 * - Timezone is derived from venue if not explicitly specified
 * - startTime/endTime are display strings in the event's local timezone
 * - All formats are defined in site.config.ts for consistency
 */

import { getVenueTimezone, siteConfig, dateTimeFormats } from '../site.config';

/**
 * Get the timezone for an event based on venue or explicit timezone field
 */
export function getEventTimezone(venue?: string, explicitTimezone?: string): string {
  // Explicit timezone takes priority
  if (explicitTimezone) {
    return explicitTimezone;
  }

  // Derive from venue or fall back to site default
  return getVenueTimezone(venue);
}

/**
 * Get timezone abbreviation (e.g., "PST", "PDT") for display
 */
export function getTimezoneAbbreviation(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat(siteConfig.locale, {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart?.value || '';
  } catch {
    return '';
  }
}

/**
 * Format event date as a readable string
 * Treats the date as a calendar date in the event's timezone
 */
export function formatEventDate(
  eventDate: Date,
  options: {
    venue?: string;
    timezone?: string;
    format?: 'long' | 'short' | 'compact';
  } = {}
): string {
  const format = options.format || 'long';

  // Select format options from config
  const formatKey =
    format === 'compact' ? 'dateCompact' : format === 'short' ? 'dateShort' : 'dateLong';

  const formatOptions: Intl.DateTimeFormatOptions = {
    ...dateTimeFormats[formatKey],
    timeZone: 'UTC', // Preserve calendar date
  };

  return eventDate.toLocaleDateString(siteConfig.locale, formatOptions);
}

/**
 * Format start/end time with timezone abbreviation
 */
export function formatEventTime(
  startTime?: string,
  endTime?: string,
  options: {
    venue?: string;
    timezone?: string;
    eventDate?: Date;
  } = {}
): string {
  if (!startTime) return '';

  const tz = getEventTimezone(options.venue, options.timezone);

  // Get timezone abbreviation from event date (for DST awareness)
  const tzAbbrev = options.eventDate ? getTimezoneAbbreviation(options.eventDate, tz) : '';

  const timeStr = endTime ? `${startTime}–${endTime}` : startTime;

  return tzAbbrev ? `${timeStr} ${tzAbbrev}` : timeStr;
}

/**
 * Combined helper for event pages
 */
export function formatEventDateTime(
  eventDate: Date,
  options: {
    startTime?: string;
    endTime?: string;
    venue?: string;
    timezone?: string;
    dateFormat?: 'long' | 'short' | 'compact';
  } = {}
): { date: string; time: string; timezone: string } {
  const tz = getEventTimezone(options.venue, options.timezone);

  return {
    date: formatEventDate(eventDate, {
      venue: options.venue,
      timezone: options.timezone,
      format: options.dateFormat,
    }),
    time: formatEventTime(options.startTime, options.endTime, {
      venue: options.venue,
      timezone: options.timezone,
      eventDate,
    }),
    timezone: tz,
  };
}

/**
 * Format a compact date/time line for cards and summaries
 * Returns: "Jan 20 · 6:00 PM–8:30 PM PST" or "Jan 20" if no time
 */
export function formatEventDateTimeLine(
  eventDate: Date,
  options: {
    startTime?: string;
    endTime?: string;
    venue?: string;
    timezone?: string;
  } = {}
): string {
  // Compact date format from config
  const shortDate = eventDate.toLocaleDateString(siteConfig.locale, {
    ...dateTimeFormats.dateCompact,
    timeZone: 'UTC',
  });

  if (!options.startTime) {
    return shortDate;
  }

  const timeStr = formatEventTime(options.startTime, options.endTime, {
    venue: options.venue,
    timezone: options.timezone,
    eventDate,
  });

  return `${shortDate} · ${timeStr}`;
}
