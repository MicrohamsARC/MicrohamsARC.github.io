import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Configuration
 * 
 * This defines the schema and validation for all markdown content.
 * Uses Astro's image() helper for optimized image handling.
 */

// Pages collection - for general site pages
const pages = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    layout: z.enum(['default', 'full-width', 'minimal']).default('default'),
    hideHeader: z.boolean().default(false),
  }),
});

// Articles/Blog posts collection
const articles = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    category: z.string().optional(),
  }),
});

// Documentation collection
const docs = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    order: z.number().default(0),
    section: z.string().optional(),
    toc: z.boolean().default(true),
  }),
});

// Teams meeting details schema (reusable)
const teamsMeetingSchema = z.object({
  link: z.string().url(),
  meetingId: z.string(),
  passcode: z.string(),
  phoneNumber: z.string().optional(),
  tollFreeNumber: z.string().optional(),
  conferenceId: z.string().optional(),
});

// Events collection
// Events can be:
// - In-person only (venue or location)
// - Online only (onlineMeeting, teams, or virtualLink)
// - Hybrid (both physical and online)
// - External (eventLink to third-party event page)
// - Informational (neither - just date/description)
const events = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    // Note: 'date' is intentionally omitted for events - use eventDate instead
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    // Event date (YYYY-MM-DD) - interpreted in the event's timezone
    eventDate: z.coerce.date(),
    // Start/end times (e.g., "6:00 PM" or "18:00") - no timezone suffix needed
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    // IANA timezone (e.g., "America/Los_Angeles") - derived from venue if not specified
    timezone: z.string().optional(),
    
    // --- Physical Location (optional) ---
    // Venue key from site.config.ts (pulls address, coords, directions, timezone)
    venue: z.enum(['building-31', 'custom']).optional(),
    // Custom location string (used if no venue, or to override venue display)
    location: z.string().optional(),
    // Map coordinates (override venue config if needed)
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    // Radio frequency for coordination at in-person events
    coordFrequency: z.string().optional(),
    
    // --- Online Meeting (optional) ---
    // Meeting key from site.config.ts (e.g., 'microhams-teams')
    onlineMeeting: z.string().optional(),
    // Direct Teams meeting details (if not using config key)
    teams: teamsMeetingSchema.optional(),
    // Simple URL for other platforms (Zoom, etc.)
    virtualLink: z.string().url().optional(),
    
    // --- External Event (optional) ---
    // Link to external event page (we're not the organizer)
    eventLink: z.string().url().optional(),
    
    eventType: z.enum(['meeting', 'conference', 'field-day', 'contest', 'social', 'workshop', 'external']).default('meeting'),
    registrationRequired: z.boolean().default(false),
    registrationLink: z.string().url().optional(),
    contactPerson: z.string().optional(),
    contactEmail: z.string().email().optional(),
    // Whether to show recording/privacy disclaimer for online meetings
    showDisclaimer: z.boolean().default(true),
  }),
});

export const collections = {
  pages,
  articles,
  docs,
  events,
};
