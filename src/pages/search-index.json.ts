/**
 * Search Index API Endpoint
 * Vignelli: "Systematic approach"
 * Generates searchable JSON index
 */

import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const docs = await getCollection('docs');

  const searchIndex = [
    ...articles.map((article: CollectionEntry<'articles'>) => ({
      title: article.data.title,
      slug: article.slug,
      description: article.data.description || '',
      type: 'article' as const,
    })),
    ...docs.map((doc: CollectionEntry<'docs'>) => ({
      title: doc.data.title,
      slug: doc.slug,
      description: doc.data.description || '',
      type: 'doc' as const,
    })),
  ];

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
