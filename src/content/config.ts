import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Configuration
 *
 * This defines the schema and validation for all markdown content.
 * Field descriptions flow to auto-generated documentation via .describe().
 */

// =============================================================================
// Shared Field Definitions
// =============================================================================
// DRY: Define once, reuse across collections. Descriptions are the source of truth.

const fields = {
  // --- Core fields (most collections) ---
  title: z.string().describe('Page or content title'),
  description: z.string().optional().describe('Brief summary for SEO and previews'),
  author: z.string().optional().describe('Author name and callsign (e.g., "Jane Smith, W1ABC")'),
  date: z.coerce.date().optional().describe('Publication date (YYYY-MM-DD)'),
  updated: z.coerce.date().optional().describe('Last update date (YYYY-MM-DD)'),
  draft: z.boolean().default(false).describe('If true, excluded from production builds'),
  publishDate: z.coerce.date().optional().describe('Scheduled publish date (YYYY-MM-DD)'),
  featured: z.boolean().default(false).describe('If true, highlighted in listings'),
  tags: z.array(z.string()).default([]).describe('Lowercase, hyphenated keywords for filtering'),

  // --- Image fields ---
  // The image parameter type comes from Astro's SchemaContext which is complex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cover: (image: any) =>
    image().optional().describe('Cover image path (relative, e.g., ./cover.jpg)'),
  coverAlt: z.string().optional().describe('Alt text for cover image (required if cover is set)'),
};

// =============================================================================
// Pages Collection
// =============================================================================

const pages = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: fields.title,
      description: fields.description,
      author: fields.author,
      date: fields.date,
      updated: fields.updated,
      draft: fields.draft,
      publishDate: fields.publishDate,
      featured: fields.featured,
      tags: fields.tags,
      cover: fields.cover(image),
      coverAlt: fields.coverAlt,
      layout: z
        .enum(['default', 'full-width', 'minimal'])
        .default('default')
        .describe('Page layout variant'),
      hideHeader: z.boolean().default(false).describe('If true, hides the page header/title block'),
    }),
});

// =============================================================================
// Articles Collection
// =============================================================================

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: fields.title,
      description: fields.description,
      author: fields.author,
      date: fields.date,
      updated: fields.updated,
      draft: fields.draft,
      publishDate: fields.publishDate,
      featured: fields.featured,
      tags: fields.tags,
      cover: fields.cover(image),
      coverAlt: fields.coverAlt,
      category: z
        .string()
        .optional()
        .describe('Article category (e.g., "guides", "news", "reviews")'),
    }),
});

// =============================================================================
// Documentation Collection
// =============================================================================

const docs = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: fields.title,
      description: fields.description,
      author: fields.author,
      date: fields.date,
      updated: fields.updated,
      draft: fields.draft,
      publishDate: fields.publishDate,
      featured: fields.featured,
      tags: fields.tags,
      cover: fields.cover(image),
      coverAlt: fields.coverAlt,
      order: z.number().default(0).describe('Sort order within section (lower = first)'),
      section: z.string().optional().describe('Documentation section for grouping'),
      toc: z.boolean().default(true).describe('If true, shows table of contents'),
    }),
});

// =============================================================================
// Events Collection
// =============================================================================

const teamsMeetingSchema = z
  .object({
    link: z.string().url().describe('Teams meeting join URL'),
    meetingId: z.string().describe('Meeting ID for manual join'),
    passcode: z.string().describe('Meeting passcode'),
    phoneNumber: z.string().optional().describe('Dial-in phone number'),
    tollFreeNumber: z.string().optional().describe('Toll-free dial-in number'),
    conferenceId: z.string().optional().describe('Phone conference ID'),
  })
  .describe('Microsoft Teams meeting details');

const customVenueSchema = z
  .object({
    name: z.string().describe('Venue name'),
    address: z.string().describe('Street address'),
    room: z.string().optional().describe('Room, shelter, or area within the venue'),
    mapUrl: z.string().url().optional().describe('Google Maps or other map link'),
    latitude: z.number().optional().describe('Map latitude'),
    longitude: z.number().optional().describe('Map longitude'),
  })
  .describe('One-off venue details (use instead of venue key for non-recurring locations)');

const events = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: fields.title,
      description: fields.description,
      author: fields.author,
      updated: fields.updated,
      draft: fields.draft,
      publishDate: fields.publishDate,
      featured: fields.featured,
      tags: fields.tags,
      cover: fields.cover(image),
      coverAlt: fields.coverAlt,

      // --- Date & Time ---
      eventDate: z.coerce.date().describe('Event date (YYYY-MM-DD), interpreted in event timezone'),
      endDate: z.coerce.date().optional().describe('End date for multi-day events (YYYY-MM-DD)'),
      startTime: z.string().optional().describe('Start time (e.g., "6:00 PM" or "18:00")'),
      endTime: z.string().optional().describe('End time (e.g., "8:30 PM" or "20:30")'),
      timezone: z
        .string()
        .optional()
        .describe(
          'IANA timezone (e.g., "America/Los_Angeles"). Defaults to venue or site timezone'
        ),

      // --- Physical Location ---
      venue: z
        .enum(['building-31', 'puyallup-fairgrounds-pavilion', 'yakima-office-of-emergency-management-parking-lot', 'custom'])
        .optional()
        .describe('Venue key from site.config.ts (provides address, coords, directions)'),
      customVenue: customVenueSchema
        .optional()
        .describe('One-off venue (use instead of venue key for non-recurring locations)'),
      location: z.string().optional().describe('Location override or additional directions'),
      latitude: z.number().optional().describe('Map latitude (overrides venue/customVenue)'),
      longitude: z.number().optional().describe('Map longitude (overrides venue/customVenue)'),
      coordFrequency: z
        .string()
        .optional()
        .describe('Radio frequency for on-site coordination (e.g., "146.580")'),

      // --- Online Meeting ---
      onlineMeeting: z
        .string()
        .optional()
        .describe('Meeting key from site.config.ts (e.g., "microhams-teams")'),
      teams: teamsMeetingSchema
        .optional()
        .describe('Direct Teams meeting details (if not using config key)'),
      virtualLink: z
        .string()
        .url()
        .optional()
        .describe('Meeting URL for other platforms (Zoom, etc.)'),

      // --- External Event ---
      eventLink: z
        .string()
        .url()
        .optional()
        .describe("Link to external event page (for events we don't organize)"),

      // --- Event Metadata ---
      eventType: z
        .enum(['meeting', 'conference', 'field-day', 'contest', 'social', 'workshop', 'external'])
        .default('meeting')
        .describe('Event category for filtering and display'),
      registrationRequired: z.boolean().default(false).describe('If true, shows registration info'),
      registrationLink: z.string().url().optional().describe('URL to registration form'),
      contactPerson: z.string().optional().describe('Event contact name and callsign'),
      contactEmail: z.string().email().optional().describe('Event contact email'),
      showDisclaimer: z
        .boolean()
        .default(true)
        .describe('If true, shows recording/privacy notice for online meetings'),
    }),
});

export const collections = {
  pages,
  articles,
  docs,
  events,
};
