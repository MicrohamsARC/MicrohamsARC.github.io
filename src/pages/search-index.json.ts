/**
 * Search Index API Endpoint
 * Vignelli: "Systematic approach"
 * Generates searchable JSON index
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const docs = await getCollection('docs');
  const projects = await getCollection('projects');

  const searchIndex = [
    ...articles.map(article => ({
      title: article.data.title,
      slug: article.slug,
      description: article.data.description || '',
      type: 'article' as const,
    })),
    ...docs.map(doc => ({
      title: doc.data.title,
      slug: doc.slug,
      description: doc.data.description || '',
      type: 'doc' as const,
    })),
    ...projects.map(project => ({
      title: project.data.title,
      slug: project.slug,
      description: project.data.description || '',
      type: 'project' as const,
    })),
  ];

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
