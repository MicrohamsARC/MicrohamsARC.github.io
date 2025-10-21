import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Configuration
 * 
 * This defines the schema and validation for all markdown content.
 * Separation of concerns: content structure is defined here, not in components.
 */

// Base schema for common front-matter fields
const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  publishDate: z.coerce.date().optional(), // Content hidden until this date
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

// Pages collection - for general site pages
const pages = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    layout: z.enum(['default', 'full-width', 'minimal']).default('default'),
    hideHeader: z.boolean().default(false), // Hide title, description, and metadata
  }),
});

// Articles/Blog posts collection
const articles = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    category: z.string().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
  }),
});

// Documentation collection
const docs = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    order: z.number().default(0),
    section: z.string().optional(),
    toc: z.boolean().default(true),
  }),
});

// Projects collection
const projects = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    status: z.enum(['active', 'completed', 'archived']).default('active'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    technologies: z.array(z.string()).default([]),
    repository: z.string().url().optional(),
    website: z.string().url().optional(),
  }),
});

// Events collection
const events = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    eventDate: z.coerce.date(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string(),
    virtualLink: z.string().url().optional(),
    eventType: z.enum(['meeting', 'conference', 'field-day', 'contest', 'social', 'workshop']).default('meeting'),
    registrationRequired: z.boolean().default(false),
    registrationLink: z.string().url().optional(),
    contactPerson: z.string().optional(),
    contactEmail: z.string().email().optional(),
  }),
});

export const collections = {
  pages,
  articles,
  docs,
  projects,
  events,
};
