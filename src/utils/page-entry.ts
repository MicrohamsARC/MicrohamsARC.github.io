import { getEntry, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type PagesEntry = CollectionEntry<'pages'>;
type RenderedPagesEntry = Awaited<ReturnType<typeof render>>;

type LoadedPageEntry = {
  frontmatter: PagesEntry['data'];
  Content: RenderedPagesEntry['Content'];
  headings: RenderedPagesEntry['headings'];
};

/**
 * Load and render a markdown page entry from the pages collection.
 */
export async function loadRenderedPageEntry(
  slug: PagesEntry['id']
): Promise<LoadedPageEntry | null> {
  const entry = await getEntry('pages', slug);

  if (!entry) {
    return null;
  }

  const { Content, headings } = await render(entry);

  return {
    frontmatter: entry.data,
    Content,
    headings,
  };
}
