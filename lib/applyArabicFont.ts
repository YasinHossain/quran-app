/**
 * Wraps Arabic characters in a span with the provided font-family.
 *
 * @param html - HTML string that may contain Arabic characters.
 * @param font - CSS font-family value to apply.
 * @returns Modified HTML with font applied to Arabic text.
 */
export function applyArabicFont(html: string, font: string): string {
  // First, remove any existing font-family spans that this function may have added previously.
  // This robustly prevents nesting <span> tags if the function is called multiple times.
  // The regex is specifically designed to match the output of the second replacement.
  const withoutExisting = html.replace(
    /<span style="font-family:&quot;[^"]+&quot;;">([\u0600-\u06FF]+)<\/span>/g,
    '$1'
  );

  // Now, wrap all sequences of Arabic characters with a new span using the specified font.
  // Using &quot; is critical to correctly handle font names that contain spaces.
  return withoutExisting.replace(
    /([\u0600-\u06FF]+)/g,
    `<span style="font-family:&quot;${font}&quot;;">$1</span>`
  );
}