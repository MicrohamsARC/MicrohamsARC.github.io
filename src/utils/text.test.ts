import { describe, it, expect } from 'vitest';
import { stripMarkdown } from './text';

describe('stripMarkdown', () => {
  it('removes bold markers', () => {
    expect(stripMarkdown('Hello **world**')).toBe('Hello world');
  });

  it('removes bold with underscores', () => {
    expect(stripMarkdown('Hello __world__')).toBe('Hello world');
  });

  it('removes italic markers', () => {
    expect(stripMarkdown('Hello *world*')).toBe('Hello world');
  });

  it('removes heading markers', () => {
    expect(stripMarkdown('## Heading')).toBe('Heading');
    expect(stripMarkdown('### Sub heading')).toBe('Sub heading');
    expect(stripMarkdown('# H1')).toBe('H1');
  });

  it('converts links to link text only', () => {
    expect(stripMarkdown('[groundwave.io](https://groundwave.io)')).toBe('groundwave.io');
  });

  it('removes image syntax entirely', () => {
    expect(stripMarkdown('![alt text](https://example.com/img.png)')).toBe('');
  });

  it('preserves list dashes', () => {
    expect(stripMarkdown('- item one')).toBe('- item one');
  });

  it('preserves horizontal rules', () => {
    expect(stripMarkdown('---')).toBe('---');
  });

  it('handles mixed formatting in one string', () => {
    expect(stripMarkdown('**6:00 PM** - [Teams](https://teams.microsoft.com)')).toBe(
      '6:00 PM - Teams'
    );
  });

  it('collapses 3+ consecutive newlines to 2', () => {
    expect(stripMarkdown('line1\n\n\n\nline2')).toBe('line1\n\nline2');
  });

  it('trims the result', () => {
    expect(stripMarkdown('  \n## Hello\n  ')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(stripMarkdown('')).toBe('');
  });
});
