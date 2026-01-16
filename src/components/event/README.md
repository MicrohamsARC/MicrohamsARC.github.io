# Event Components

Components for displaying event information with timezone-aware date/time handling.

## Components

### EventCard

Display component for event listings. Supports three layout variants:

| Variant | Use Case |
|---------|----------|
| `default` | Compact cards for grid layouts (past events) |
| `horizontal` | List items with calendar icon (upcoming events) |
| `featured` | Hero-style card with image (homepage) |

```astro
<EventCard event={event} variant="horizontal" showJoinButtons />
```

**Props:**
- `event` — Collection entry from `events` collection (required)
- `variant` — Layout variant: `default`, `horizontal`, or `featured`
- `showDescription` — Show event description text (default: `true`)
- `showJoinButtons` — Show "Join In Person" / "Join Online" buttons (default: `false`)

### EventDateTime

Interactive date/time display that toggles between browser local timezone and UTC on click.

```astro
<EventDateTime 
  eventDate={event.data.eventDate}
  startTime={event.data.startTime}
  endTime={event.data.endTime}
  venue={event.data.venue}
/>
```

**Props:**
- `eventDate` — JavaScript `Date` object (required)
- `startTime` — Time string like `"6:00 PM"` or `"18:00"`
- `endTime` — Optional end time
- `venue` — Venue key from `site.config.ts` (determines timezone)
- `timezone` — Explicit IANA timezone (overrides venue)
- `class` — CSS class for styling

The component renders a `<button>` that shows the server-rendered time on initial load, then hydrates to enable toggling. Click cycles between local timezone → UTC → local.

### EventLogistics

Renders venue directions, map, and online meeting details from centralized configuration.

```astro
<EventLogistics 
  venue="building-31"
  onlineMeeting="microhams-teams"
/>
```

**Props:**
- `venue` — Key from `venues` in `site.config.ts`
- `onlineMeeting` — Key from `onlineMeetings` in `site.config.ts`
- `location` — Custom location string (overrides venue address display)
- `latitude`, `longitude` — Map coordinates (overrides venue coords)
- `coordFrequency` — Radio frequency for event coordination
- `teams` — Direct Teams meeting object (if not using config key)
- `showDisclaimer` — Show recording/privacy notice (default: `true`)

### EventMap

Renders a static map image with a link to Google Maps.

```astro
<EventMap latitude={47.643} longitude={-122.122} />
```

## Configuration Files

### `site.config.ts`

Centralized configuration for venues and online meetings. Events reference these by key rather than duplicating details in frontmatter.

```typescript
// Venue configuration
export const venues = {
  'building-31': {
    name: 'Building 31, Microsoft Campus',
    address: '3730 163rd Ave NE, Redmond, WA 98052',
    latitude: 47.643592,
    longitude: -122.122402,
    timezone: 'America/Los_Angeles',
    arrival: { intro, escort, noRadio },
    directions: { sr520, belred, parking },
  },
};

// Online meeting configuration  
export const onlineMeetings = {
  'microhams-teams': {
    platform: 'teams',
    link: '...',
    meetingId: '...',
    passcode: '...',
    // ... dial-in numbers, disclaimer text
  },
};
```

### `utils/event-time.ts`

Server-side utilities for formatting dates and times with timezone awareness.

### `lib/event-datetime-toggle.ts`

Client-side script for the timezone toggle interaction. Handles:
- Parsing time strings (`"6:00 PM"` → hours/minutes)
- Converting between timezones
- Formatting display strings
- Click handler for cycling modes

## Event Frontmatter

Events are stored in `src/content/events/` as markdown files with YAML frontmatter.

### Minimal Example (Hybrid Meeting)

```yaml
---
title: "January Meeting: Topic Name"
description: "Brief description for listings and SEO."
eventDate: 2026-01-20
startTime: "6:00 PM"
endTime: "8:30 PM"
venue: "building-31"
onlineMeeting: "microhams-teams"
eventType: "meeting"
featured: true
---

Meeting content goes here...
```

### Event Types

Events can be configured for different attendance modes:

| Type | Frontmatter |
|------|-------------|
| In-person only | `venue: "building-31"` (no online meeting) |
| Online only | `onlineMeeting: "microhams-teams"` (no venue) |
| Hybrid | Both `venue` and `onlineMeeting` |
| External | `eventLink: "https://..."` with `eventType: "external"` |
| Informational | Just `eventDate` (no venue or meeting) |

### Full Schema Reference

```yaml
# Required
title: string
eventDate: YYYY-MM-DD  # Calendar date in event timezone

# Scheduling (optional)
startTime: "6:00 PM"   # Time string (12 or 24 hour)
endTime: "8:30 PM"
timezone: "America/Los_Angeles"  # IANA timezone (derived from venue if omitted)

# Physical Location (optional)
venue: "building-31"   # Key from site.config.ts venues
location: string       # Custom location (overrides venue display)
latitude: number       # Map coordinates (overrides venue)
longitude: number
coordFrequency: "146.580"  # Radio frequency for coordination

# Online Meeting (optional)
onlineMeeting: "microhams-teams"  # Key from site.config.ts
teams:                 # Or provide inline Teams details:
  link: url
  meetingId: string
  passcode: string
virtualLink: url       # Simple URL for non-Teams platforms

# External Event (optional)
eventLink: url         # Link to third-party event page
eventType: "external"

# Metadata
eventType: meeting | conference | field-day | contest | social | workshop | external
featured: boolean      # Show on homepage
draft: boolean         # Hide from listings
publishDate: date      # Scheduled publish date
tags: [string]
cover: ./image.jpg     # Co-located image
coverAlt: string

# Contact
contactPerson: string
contactEmail: email
registrationRequired: boolean
registrationLink: url
showDisclaimer: boolean  # Show recording notice (default: true)
```

### Date Handling

The `eventDate` field stores a calendar date (no time component). It's stored as midnight UTC but interpreted as the local calendar date in the event's timezone.

Times in `startTime` and `endTime` are strings like `"6:00 PM"` or `"18:00"`. The timezone is determined by:

1. Explicit `timezone` field in frontmatter
2. Timezone from the referenced `venue` config
3. Site default (`America/Los_Angeles`)

The EventDateTime component combines date + time + timezone to create proper UTC timestamps for conversion to the user's local timezone.

## File Structure

```
src/
├── components/event/
│   ├── EventCard.astro       # Display variants for listings
│   ├── EventDateTime.astro   # Interactive timezone toggle
│   ├── EventLogistics.astro  # Venue/meeting templated details
│   ├── EventMap.astro        # Static map image
│   └── README.md             # This file
├── lib/
│   └── event-datetime-toggle.ts  # Client-side toggle logic
├── utils/
│   └── event-time.ts         # Server-side formatting
├── site.config.ts            # Venue and meeting configs
└── content/
    └── events/
        └── {event-slug}/
            ├── index.md      # Event content and frontmatter
            └── cover.jpg     # Co-located images
```
