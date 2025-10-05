import DOMPurify from 'isomorphic-dompurify';

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
  try {
    return DOMPurify.sanitize(html);
  } catch {
    // Minimal fallback: strip script/style/iframe and all tags, keep text.
    try {
      let safe = html
        .replace(/<\/(?:script|style|iframe)[^>]*>/gi, '')
        .replace(/<(?:script|style|iframe)(.|\n|\r)*?>/gi, '');
      safe = safe.replace(/<[^>]*>/g, '');
      return safe;
    } catch {
      return '';
    }
  }
}
