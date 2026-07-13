#!/usr/bin/env npx tsx

/**
 * Internal Link Checker
 *
 * Parses the built ./dist HTML and verifies that every internal link,
 * asset reference, and same-page anchor resolves to something that
 * actually exists in the build.
 *
 * Deliberately dependency-free on the network side: no HTTP, no
 * third-party actions. It only uses jsdom (already a dev dependency)
 * and the filesystem, so it is deterministic and cannot produce the
 * network false-positives (403/429/timeouts) that external link
 * checkers are prone to. External links (http/https/mailto/tel/...)
 * are intentionally skipped — they rot on someone else's schedule and
 * do not belong in a PR-blocking check.
 *
 * Exit code 1 if any internal link is broken, 0 otherwise.
 */

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const DIST = path.resolve('dist');

// (CSS selector, attribute) pairs that carry URLs we can resolve to files.
const URL_ATTRS: Array<[string, string]> = [
  ['a[href]', 'href'],
  ['link[href]', 'href'],
  ['img[src]', 'src'],
  ['script[src]', 'src'],
  ['source[src]', 'src'],
];
// srcset attributes are comma-separated "url descriptor" lists, handled separately.
const SRCSET_SELECTORS = ['img[srcset]', 'source[srcset]'];

// URL prefixes that mean "not an internal link we resolve on disk".
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i; // scheme: or protocol-relative //

interface Broken {
  file: string;
  link: string;
  reason: string;
}

/** Recursively collect every .html file under dist. */
function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Cache of a target HTML file's fragment ids (id="" / name="") so we only parse each once.
const idCache = new Map<string, Set<string>>();
function fragmentIds(file: string): Set<string> {
  const cached = idCache.get(file);
  if (cached) return cached;
  const ids = new Set<string>();
  try {
    const doc = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
    for (const el of doc.querySelectorAll('[id]')) ids.add(el.id);
    for (const el of doc.querySelectorAll('[name]')) {
      const n = el.getAttribute('name');
      if (n) ids.add(n);
    }
  } catch {
    /* unreadable/unparseable target — fragment simply won't be found */
  }
  idCache.set(file, ids);
  return ids;
}

/**
 * Resolve an internal URL path to the file on disk that would serve it.
 * Returns the resolved file path, or null if nothing matches.
 * Astro's default "directory" build emits /foo/index.html served at /foo/ or /foo.
 */
function resolveToFile(urlPath: string, fromFile: string): string | null {
  const base = urlPath.startsWith('/')
    ? path.join(DIST, urlPath)
    : path.resolve(path.dirname(fromFile), urlPath);

  const candidates = urlPath.endsWith('/')
    ? [path.join(base, 'index.html')]
    : [base, path.join(base, 'index.html'), `${base}.html`];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function checkFile(file: string, broken: Broken[]): void {
  const doc = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;

  // Gather (element, rawUrl) pairs.
  const links: string[] = [];
  for (const [selector, attr] of URL_ATTRS) {
    for (const el of doc.querySelectorAll(selector)) {
      const v = el.getAttribute(attr);
      if (v) links.push(v);
    }
  }
  for (const selector of SRCSET_SELECTORS) {
    for (const el of doc.querySelectorAll(selector)) {
      const v = el.getAttribute('srcset');
      if (!v) continue;
      for (const part of v.split(',')) {
        const url = part.trim().split(/\s+/)[0];
        if (url) links.push(url);
      }
    }
  }

  for (const raw of links) {
    const link = raw.trim();
    if (!link || (link.startsWith('#') && link.length === 1)) continue; // "" or bare "#"
    if (EXTERNAL.test(link)) continue; // external scheme or //host
    if (link.startsWith('data:')) continue; // (already caught by EXTERNAL, defensive)

    // Split off query and fragment.
    const hashIdx = link.indexOf('#');
    const fragment = hashIdx >= 0 ? link.slice(hashIdx + 1) : '';
    let pathPart = (hashIdx >= 0 ? link.slice(0, hashIdx) : link).split('?')[0];

    // Same-page anchor (href="#section").
    if (pathPart === '') {
      if (fragment && fragment !== 'top' && !fragmentIds(file).has(decode(fragment))) {
        broken.push({ file, link, reason: `no element with id/name "${fragment}"` });
      }
      continue;
    }

    pathPart = decode(pathPart);
    const target = resolveToFile(pathPart, file);
    if (!target) {
      broken.push({ file, link, reason: 'target file not found' });
      continue;
    }
    // Cross-document fragment: verify the anchor exists in the target.
    if (fragment && fragment !== 'top' && target.endsWith('.html')) {
      if (!fragmentIds(target).has(decode(fragment))) {
        broken.push({ file, link, reason: `target exists but has no id/name "${fragment}"` });
      }
    }
  }
}

function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function rel(p: string): string {
  return path.relative(process.cwd(), p);
}

function main(): void {
  if (!fs.existsSync(DIST)) {
    console.error(`✗ dist/ not found at ${DIST}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const files = htmlFiles(DIST);
  const broken: Broken[] = [];
  for (const file of files) checkFile(file, broken);

  if (broken.length === 0) {
    console.log(`✓ Internal links OK — checked ${files.length} HTML file(s), no broken links.`);
    return;
  }

  console.error(
    `✗ ${broken.length} broken internal link(s) across ${files.length} HTML file(s):\n`
  );
  for (const b of broken) {
    console.error(`  ${rel(b.file)}\n    → ${b.link}  (${b.reason})`);
  }
  process.exit(1);
}

main();
