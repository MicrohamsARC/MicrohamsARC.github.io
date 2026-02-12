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

/**
 * ============================================================================
 * Timezone-Aware Timestamp Calculation (Issue #12 fix)
 *
 * Uses the Temporal API (via polyfill) to correctly calculate event timestamps
 * in their intended timezone, avoiding JavaScript Date's UTC interpretation bug.
 * ============================================================================
 */

import { Temporal } from '@js-temporal/polyfill';

/**
 * Parse a time string like "6:00 PM" or "18:00" into hours and minutes
 */
function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  // Try 12-hour format: "6:00 PM", "12:30 AM"
  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3]?.toUpperCase();

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
  }

  // Try 24-hour format: "18:00", "09:30"
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return {
      hours: parseInt(match24[1], 10),
      minutes: parseInt(match24[2], 10),
    };
  }

  return null;
}

/**
 * Get the correct UTC timestamp for an event given its calendar date, time, and timezone.
 *
 * This fixes the bug where JavaScript Date interprets "2026-01-20" as UTC midnight,
 * causing the calendar date to shift in western timezones.
 *
 * @param eventDate - The event date (typically from YAML, parsed as UTC midnight)
 * @param startTime - Time string like "6:00 PM" or "18:00"
 * @param timezone - IANA timezone like "America/Los_Angeles"
 * @returns Unix timestamp in milliseconds
 */
export function getEventTimestampInTimezone(
  eventDate: Date,
  startTime: string | undefined,
  timezone: string
): number {
  // Extract the calendar date components from the UTC date
  // (since YAML dates are parsed as UTC midnight, these are the intended date)
  const year = eventDate.getUTCFullYear();
  const month = eventDate.getUTCMonth() + 1; // Temporal uses 1-indexed months
  const day = eventDate.getUTCDate();

  // Create a PlainDate (just a calendar date, no timezone)
  const plainDate = Temporal.PlainDate.from({ year, month, day });

  // Parse the time, default to midnight if not provided
  let hours = 0;
  let minutes = 0;
  if (startTime) {
    const parsed = parseTimeString(startTime);
    if (parsed) {
      hours = parsed.hours;
      minutes = parsed.minutes;
    }
  }

  // Create a PlainTime
  const plainTime = Temporal.PlainTime.from({ hour: hours, minute: minutes });

  // Combine date and time in the event's timezone
  const zonedDateTime = plainDate.toZonedDateTime({
    timeZone: timezone,
    plainTime,
  });

  // Convert to milliseconds since epoch
  return Number(zonedDateTime.epochMilliseconds);
}

/**
 * Check if an event time has passed relative to a given "now" time.
 *
 * @param eventDate - The event date
 * @param time - Time string like "6:00 PM"
 * @param timezone - Event timezone
 * @param now - Current time (defaults to new Date())
 * @returns true if the event time is in the past
 */
export function isEventPast(
  eventDate: Date,
  time: string | undefined,
  timezone: string,
  now: Date = new Date()
): boolean {
  const eventTimestamp = getEventTimestampInTimezone(eventDate, time, timezone);
  return eventTimestamp < now.getTime();
}
