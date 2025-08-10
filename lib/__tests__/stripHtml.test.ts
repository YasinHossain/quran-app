/**
 * stripHtml — removes HTML tags and collapses whitespace.
 * Note: This is not a sanitizer; it's for producing plain text from small HTML snippets.
 */
export function stripHtml(input: string): string {
  if (input == null) return '';
  const str = String(input);

  // Remove comments, script/style blocks, then any remaining tags
  const withoutTags = str
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  // Normalize whitespace and trim
  return withoutTags.replace(/\s+/g, ' ').trim();
}

export default stripHtml;
