/**
 * Strip Markdown formatting from a string, producing clean plain text.
 * Intended for generating email-friendly plain text from Markdown content.
 */
export function stripMarkdown(raw: string): string {
  return (
    raw
      // Remove images before links (avoid matching image alt as link text)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      // Convert links: [text](url) → text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove heading markers (## Heading → Heading)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/gs, '$1')
      .replace(/__(.*?)__/gs, '$1')
      // Remove italic (*text* or _text_), but not list dashes
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1')
      .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '$1')
      // Trim trailing whitespace per line
      .replace(/[ \t]+$/gm, '')
      // Collapse 3+ newlines to 2
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
