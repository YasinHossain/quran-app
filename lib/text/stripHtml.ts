/**
 * Removes HTML tags from a string.
 *
 * @param html - The HTML string to clean.
 * @returns The plain text content with all tags removed.
 */
export function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  return html.replace(/<[^>]*>/g, '');
}
