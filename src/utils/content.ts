/**
 * Content Utilities
 * 
 * Helper functions for filtering and managing content based on
 * draft status and publish dates.
 */

/**
 * Check if content should be published based on draft status and publishDate
 * 
 * In development mode, drafts and future-dated content are shown.
 * In production, only non-draft content with past/current publishDate is shown.
 * 
 * @param data - Content data with draft and publishDate fields
 * @returns true if content should be visible
 */
export function isPublished(data: { draft?: boolean; publishDate?: Date }): boolean {
  // In dev mode, show everything (drafts and future content)
  if (import.meta.env.DEV) {
    return true;
  }
  
  // Production: hide if marked as draft
  if (data.draft === true) {
    return false;
  }
  
  // Production: hide if publishDate is in the future
  if (data.publishDate) {
    const now = new Date();
    return data.publishDate <= now;
  }
  
  // Show by default if not draft and no future publish date
  return true;
}

/**
 * Filter function for use with getCollection()
 * 
 * Usage: getCollection('articles', publishedFilter)
 */
export function publishedFilter({ data }: { data: { draft?: boolean; publishDate?: Date } }): boolean {
  return isPublished(data);
}

/**
 * Combined filter for published and featured content
 */
export function publishedAndFeaturedFilter({ data }: { data: { draft?: boolean; publishDate?: Date; featured?: boolean } }): boolean {
  return isPublished(data) && data.featured === true;
}
