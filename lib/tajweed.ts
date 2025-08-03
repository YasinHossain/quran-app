/**
 * Applies basic Tajweed highlighting by wrapping specific Arabic letters
 * with Tailwind CSS classes: the letter م uses `text-red-600` and ن uses `text-green-600`.
 *
 * @param text - The original text to highlight.
 * @returns The text with Tajweed markup applied.
 */
export function applyTajweed(text: string): string {
  return text
    .replace(/م/g, '<span class="text-red-600">م</span>')
    .replace(/ن/g, '<span class="text-green-600">ن</span>');
}
