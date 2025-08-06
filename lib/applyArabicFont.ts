/**
 * Wraps Arabic characters in a span with the provided font-family.
 *
 * @param html - HTML string that may contain Arabic characters.
 * @param font - CSS font-family value to apply.
 * @returns Modified HTML with font applied to Arabic text.
 */
export function applyArabicFont(html: string, font: string): string {
  const withoutExisting = html.replace(
    /<span style="font-family:[^"]+;">([\u0600-\u06FF]+)<\/span>/g,
    '$1'
  );
  return withoutExisting.replace(
    /([\u0600-\u06FF]+)/g,
    `<span style="font-family:${font};">$1</span>`
  );
}
