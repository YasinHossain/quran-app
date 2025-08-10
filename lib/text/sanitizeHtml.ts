import DOMPurify from 'dompurify';

/**
 * Sanitize an HTML string to remove any potentially unsafe content.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}

export default sanitizeHtml;
