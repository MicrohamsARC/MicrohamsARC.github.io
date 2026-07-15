/**
 * Format a tag/category label for display in a pill.
 *
 * Capitalises the first letter of each word so labels read consistently
 * ("community" → "Community"), but leaves two kinds of token exactly as
 * authored:
 *   - all-caps tokens — acronyms and callsigns (ARRL, HF, N7OS)
 *   - tokens with an interior capital — proper names (MicroHAMS)
 *
 * Spaces and hyphens are preserved as separators and each sub-word is treated
 * independently ("field-day" → "Field-Day").
 */
export function formatLabel(label: string): string {
  const capitalize = (word: string): string => {
    if (!word) return word;
    if (word === word.toUpperCase()) return word; // acronym / callsign
    if (/[A-Z]/.test(word.slice(1))) return word; // interior caps (MicroHAMS)
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  return label
    .split(/(\s+|-)/)
    .map((part) => (/^(\s+|-)$/.test(part) ? part : capitalize(part)))
    .join('');
}

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
