/**
 * Applies basic Tajweed highlighting by wrapping specific Arabic letters
 * with design system color classes for consistent theming.
 *
 * @param text - The original text to highlight.
 * @returns The text with Tajweed markup applied.
 */
export function applyTajweed(text: string): string {
  return text
    .replace(/م/g, '<span class="text-error">م</span>')
    .replace(/ن/g, '<span class="text-accent">ن</span>');
}
