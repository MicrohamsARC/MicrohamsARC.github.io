# Events System Documentation

## Overview

The Events system allows you to create and manage event announcements with full support for upcoming/past filtering, virtual attendance, and homepage featuring.

## Implementation Summary

### Date: October 21, 2025

**Changes Made:**

1. **Content Collection** - Added `events` collection to `content/config.ts`
2. **Event Content** - Converted `content/events/Member meeting.md` to proper event format
3. **Events Listing** - Created `/events` route with upcoming/past filtering
4. **Individual Events** - Created `/events/[slug]` route for event details
5. **Homepage Feature** - Added featured upcoming event section to homepage

## Content Structure

### Events Collection Schema

Located in `content/config.ts`:

```typescript
const events = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    eventDate: z.coerce.date(),           // Required: Event date
    startTime: z.string().optional(),     // e.g., "6:00 PM PDT"
    endTime: z.string().optional(),       // e.g., "8:30 PM PDT"
    location: z.string(),                 // Physical location
    virtualLink: z.string().url().optional(), // Teams/Zoom link
    eventType: z.enum([                   // Event category
      'meeting',
      'conference',
      'field-day',
      'contest',
      'social',
      'workshop'
    ]).default('meeting'),
    registrationRequired: z.boolean().default(false),
    registrationLink: z.string().url().optional(),
    contactPerson: z.string().optional(),
    contactEmail: z.string().email().optional(),
  }),
});
```

### Event Front Matter Example

```markdown
---
title: "October 2025 Monthly Member Meeting"
description: "Join us for our monthly meeting featuring Amateur Radio Pro Tips"
author: "Brian Stucker, KB2S"
date: 2025-10-21
eventDate: 2025-10-21
startTime: "6:00 PM PDT"
endTime: "8:30 PM PDT"
location: "Microsoft Building 31, 3730 163rd Ave NE, Redmond, WA 98052"
virtualLink: "https://teams.microsoft.com/meet/..."
eventType: "meeting"
registrationRequired: false
contactPerson: "Brian Stucker, KB2S"
featured: true
tags: ["monthly-meeting", "pro-tips", "microsoft-campus", "hybrid-event"]
---

Event content goes here...
```

## Routes

### `/events` - Events Listing Page

**Features:**
- Splits events into "Upcoming" and "Past" sections
- Upcoming events sorted by date (soonest first)
- Past events sorted by date (most recent first)
- Card-based layout with event metadata
- Event type badges with color coding
- Links to event details and virtual attendance

**Badge Color Mapping:**
- `meeting` → Primary (blue)
- `conference` → Accent (purple)
- `field-day` → Success (green)
- `contest` → Warning (orange)
- `social` → Info (teal)
- `workshop` → Secondary (gray)

### `/events/[slug]` - Individual Event Page

**Features:**
- Full event details in prominent card
- Date, time, location information
- Virtual attendance link (if available)
- Registration link (if required)
- Contact information
- Event content rendered from markdown
- Breadcrumb navigation
- Status badges (Upcoming/Past Event)

### Homepage Featured Event

**Features:**
- Shows the next upcoming featured event
- Prominent section with primary color background
- Quick access to event details and virtual link
- Only shows if event has `featured: true` in front matter
- Automatically filters out past events

## File Locations

```
content/
├── events/
│   └── Member meeting.md        # October 2025 meeting announcement
└── config.ts                     # Contains events collection schema

src/
└── pages/
    ├── events/
    │   ├── index.astro          # Events listing page
    │   └── [slug].astro         # Individual event page
    └── index.astro               # Homepage (includes featured event)
```

## Build Output

The build generates:
- `/events/index.html` - Events listing
- `/events/[slug]/index.html` - Individual event pages
- Homepage includes featured event section

**Current build:** 11 pages total
- Previous: 9 pages
- Added: `/events/` and `/events/member-meeting/`

## Usage Guide

### Creating a New Event

1. Create a new `.md` file in `content/events/`
2. Add complete front matter with required fields
3. Write event content in markdown
4. Build will automatically generate the page

### Featuring an Event on Homepage

Set `featured: true` in the event's front matter:

```yaml
featured: true
```

Only the next upcoming featured event will appear on the homepage.

### Event Types

Choose from these event types for appropriate badge colors:
- `meeting` - Regular club meetings
- `conference` - Conferences like MHDC
- `field-day` - Field Day operations
- `contest` - Contest events
- `social` - Social gatherings
- `workshop` - Training/workshop sessions

### Virtual Events

For hybrid or virtual events, add:

```yaml
virtualLink: "https://teams.microsoft.com/meet/..."
```

This creates a "Join Virtual Meeting" button on both the listing and detail pages.

### Registration

For events requiring registration:

```yaml
registrationRequired: true
registrationLink: "https://registration-url.com"
```

## Design System Integration

The events pages use the existing design system:
- **Cards** - Event listings use `.card` with interactive variant
- **Badges** - Event type and status indicators
- **Buttons** - Primary/secondary/ghost variants
- **Typography** - Text scale and flow utilities
- **Layout** - Region, wrapper, stack, cluster, grid primitives
- **Colors** - OKLCH-based color tokens

## Accessibility Features

- Semantic HTML (`<article>`, `<time>`, `<nav>`)
- ARIA labels for breadcrumbs
- Proper datetime attributes
- Keyboard-accessible interactive elements
- Color contrast compliant badges

## Future Enhancements

Potential additions:
- Calendar integration (iCal export)
- Event categories/filtering
- Event search functionality
- Recurring events support
- RSVP/attendance tracking
- Event photo galleries
- Past event recordings/notes

## Testing Checklist

- [x] Events collection schema validates
- [x] Events listing page builds
- [x] Individual event pages build
- [x] Homepage features upcoming event
- [x] Upcoming/past filtering works
- [x] Virtual links display correctly
- [x] Event type badges show correct colors
- [x] Breadcrumb navigation works
- [x] Mobile responsive layout
- [x] Build completes without errors

## Verification

Build output confirms successful implementation:

```
✓ /events/index.html
✓ /events/member-meeting/index.html
✓ 11 page(s) built in 656ms
```

All routes accessible:
- https://site.com/events
- https://site.com/events/member-meeting
- Homepage at https://site.com/ includes featured event

---

**Created:** October 21, 2025  
**Status:** ✅ Complete and verified
