/**
 * Contributing Documentation Navigation
 *
 * Defines the sidebar structure for /contributing pages.
 */

export const contributingNav = [
  {
    label: 'Overview',
    href: '/contributing',
  },
  {
    label: 'Adding Content',
    children: [
      { label: 'Editorial Guidelines', href: '/contributing/editorial' },
      { label: 'Articles', href: '/contributing/articles' },
      { label: 'Events', href: '/contributing/events' },
      { label: 'Documentation', href: '/contributing/docs' },
      { label: 'Pages (About)', href: '/contributing/pages' },
      { label: 'Venues', href: '/contributing/venues' },
      { label: 'Online Meetings', href: '/contributing/online-meetings' },
    ],
  },
  {
    label: 'Reference',
    children: [
      { label: 'Markdown', href: '/contributing/markdown' },
      { label: 'Typography', href: '/contributing/typography' },
      { label: 'Design Language', href: '/contributing/design' },
      { label: 'Date & Time', href: '/contributing/date-time' },
      { label: 'Tags', href: '/contributing/tags' },
      { label: 'Schema Reference', href: '/contributing/schemas' },
      { label: 'Glossary', href: '/contributing/glossary' },
    ],
  },
  {
    label: 'Development',
    children: [
      { label: 'Local Setup', href: '/contributing/setup' },
      { label: 'Pull Requests', href: '/contributing/pull-requests' },
      { label: 'How It Works', href: '/contributing/how-it-works' },
    ],
  },
];
