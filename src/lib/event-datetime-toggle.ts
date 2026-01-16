/**
 * Event DateTime Toggle
 * 
 * Client-side script for toggling event times between:
 * - Browser local timezone (default)
 * - UTC
 * 
 * Usage: Add data attributes to a <button> element:
 * - data-event-datetime: ISO string of the event date
 * - data-start-time: Start time string (e.g., "6:00 PM")
 * - data-end-time: End time string (optional)
 * - data-timezone: IANA timezone (e.g., "America/Los_Angeles")
 */

type TimezoneMode = 'local' | 'utc';

interface EventDateTimeElement extends HTMLButtonElement {
  _tzMode?: TimezoneMode;
  _eventDate?: Date;
  _startTime?: string;
  _endTime?: string;
  _eventTimezone?: string;
}

/**
 * Parse time string like "6:00 PM" into hours and minutes
 */
function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return { hours, minutes };
}

/**
 * Create a Date object representing the event time as a UTC timestamp.
 * Given: calendar date (as UTC midnight), time string, and event timezone.
 * Returns: Date object where displaying in event timezone shows the correct time.
 * 
 * Example: Jan 20 + "6:00 PM" + Pacific → UTC timestamp for Jan 21 02:00:00Z
 * (because 6 PM Pacific = 2 AM UTC next day during PST)
 */
function createEventDateTime(eventDate: Date, timeStr: string, eventTimezone: string): Date {
  const time = parseTime(timeStr);
  if (!time) return eventDate;
  
  // Get calendar date parts from the event date (stored as UTC midnight)
  const year = eventDate.getUTCFullYear();
  const month = eventDate.getUTCMonth();
  const day = eventDate.getUTCDate();
  
  // Create an ISO date-time string representing this time in the event timezone
  // Format: "2026-01-20T18:00:00" (no Z suffix - we'll interpret in target TZ)
  const localDateTimeStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:00`;
  
  // Use a trick: create a formatter that outputs the timezone offset
  // Then we can calculate what UTC instant this represents
  const testDate = new Date(localDateTimeStr + 'Z'); // Treat as UTC temporarily
  
  // Get the timezone offset at this approximate time
  // Format the testDate in the event timezone and extract hour/minute
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: eventTimezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(testDate);
  
  const tzHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const tzMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  
  // testDate as UTC shows time.hours:time.minutes
  // testDate in event TZ shows tzHour:tzMinute
  // The difference tells us the offset
  // 
  // For PST (UTC-8): if testDate is 18:00 UTC, it shows 10:00 in Pacific
  // We want 18:00 in Pacific, so we need to ADD 8 hours to UTC
  // Offset = (what we want in local) - (what local shows for our UTC guess)
  //        = 18:00 - 10:00 = +8 hours
  // Correct UTC = 18:00 + 8:00 = 26:00 = 02:00 next day
  
  const wantedMinutes = time.hours * 60 + time.minutes;
  const gotMinutes = tzHour * 60 + tzMinute;
  let diffMinutes = wantedMinutes - gotMinutes;
  
  // Handle day wraparound (e.g., want 2:00, got 18:00 = -16 hours, but really +8)
  if (diffMinutes > 720) diffMinutes -= 1440;
  if (diffMinutes < -720) diffMinutes += 1440;
  
  // The correct UTC time is the test date plus the difference
  const correctUTC = new Date(testDate.getTime() + diffMinutes * 60000);
  
  return correctUTC;
}

/**
 * Format time for display in a specific timezone
 */
function formatTimeInZone(date: Date, timezone: string): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get timezone abbreviation
 */
function getTimezoneAbbr(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(date);
  return parts.find(p => p.type === 'timeZoneName')?.value || '';
}

/**
 * Format the full date/time display
 */
function formatDisplay(
  eventDate: Date,
  startTime: string | undefined,
  endTime: string | undefined,
  eventTimezone: string,
  mode: TimezoneMode
): string {
  const targetTz = mode === 'utc' ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format date part
  const dateStr = eventDate.toLocaleDateString('en-US', {
    timeZone: 'UTC', // Keep calendar date stable
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  if (!startTime) {
    const tzAbbr = getTimezoneAbbr(eventDate, targetTz);
    return `${dateStr} ${tzAbbr}`;
  }
  
  // For time conversion, we need to create actual Date objects
  const startDateTime = createEventDateTime(eventDate, startTime, eventTimezone);
  const startFormatted = formatTimeInZone(startDateTime, targetTz);
  
  let timeStr = startFormatted;
  if (endTime) {
    const endDateTime = createEventDateTime(eventDate, endTime, eventTimezone);
    const endFormatted = formatTimeInZone(endDateTime, targetTz);
    timeStr = `${startFormatted}–${endFormatted}`;
  }
  
  const tzAbbr = getTimezoneAbbr(startDateTime, targetTz);
  
  return `${dateStr} · ${timeStr} ${tzAbbr}`;
}

/**
 * Initialize a datetime toggle button
 */
function initToggle(button: EventDateTimeElement): void {
  const isoDate = button.dataset.eventDatetime;
  const startTime = button.dataset.startTime;
  const endTime = button.dataset.endTime;
  const timezone = button.dataset.timezone || 'America/Los_Angeles';
  
  if (!isoDate) return;
  
  button._eventDate = new Date(isoDate);
  button._startTime = startTime;
  button._endTime = endTime;
  button._eventTimezone = timezone;
  button._tzMode = 'local';
  
  // Set initial display
  updateDisplay(button);
  
  // Add click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    cycleMode(button);
  });
}

/**
 * Cycle through timezone modes
 */
function cycleMode(button: EventDateTimeElement): void {
  button._tzMode = button._tzMode === 'local' ? 'utc' : 'local';
  updateDisplay(button);
}

/**
 * Update the button's display text
 */
function updateDisplay(button: EventDateTimeElement): void {
  if (!button._eventDate) return;
  
  const display = formatDisplay(
    button._eventDate,
    button._startTime,
    button._endTime,
    button._eventTimezone || 'America/Los_Angeles',
    button._tzMode || 'local'
  );
  
  // Find or create the text span
  let textSpan = button.querySelector('.datetime-text');
  if (!textSpan) {
    textSpan = document.createElement('span');
    textSpan.className = 'datetime-text';
    button.prepend(textSpan);
  }
  textSpan.textContent = display;
  
  // Remove mode indicator - timezone is already shown in the display
  const modeSpan = button.querySelector('.datetime-mode');
  if (modeSpan) {
    modeSpan.textContent = '';
  }
}

/**
 * Initialize all datetime toggles on the page
 */
export function initDateTimeToggles(): void {
  document.querySelectorAll<EventDateTimeElement>('[data-event-datetime]').forEach(button => {
    // Skip if already initialized
    if (button._eventDate) return;
    initToggle(button);
  });
}

// Auto-initialize when DOM is ready
// Supports both initial load and Astro View Transitions
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDateTimeToggles);
  } else {
    // DOM already ready, initialize immediately
    initDateTimeToggles();
  }
  
  // Re-initialize after Astro View Transitions swap content
  document.addEventListener('astro:page-load', initDateTimeToggles);
}
