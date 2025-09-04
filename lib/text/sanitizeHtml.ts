import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Fallback lightweight sanitizer that works without external deps.
// If `isomorphic-dompurify` is available at runtime, we use it.
let DOMPurify: { sanitize: (html: string) => string } | null = null;
try {
  DOMPurify = require('isomorphic-dompurify');
} catch {
  DOMPurify = null;
}

/**
 * Sanitize a string containing HTML and return a safe version.
 *
 * This utility works in both browser and server environments, making it
 * suitable for sanitizing user provided markup before rendering.
 *
 * @param html - The raw HTML to sanitize.
 * @returns The sanitized HTML string.
 *
 * @example
 * const safe = sanitizeHtml('<p>Hi</p><script>alert(1)</script>');
 * // => '<p>Hi</p>'
 */
export function sanitizeHtml(html: string): string {
  if (DOMPurify) {
    return DOMPurify.sanitize(html);
  }
  // Minimal fallback: strip script/style/iframe and all tags, keep text.
  // This is conservative to ensure safety when DOMPurify isn't installed.
  try {
    // Remove dangerous blocks first
    let safe = html
      .replace(/<\/(?:script|style|iframe)[^>]*>/gi, '')
      .replace(/<(?:script|style|iframe)(.|\n|\r)*?>/gi, '');
    // Remove all other tags
    safe = safe.replace(/<[^>]*>/g, '');
    return safe;
  } catch {
    return '';
  }
}
