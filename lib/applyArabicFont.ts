export function applyArabicFont(html: string, font: string): string {
  return html.replace(/([\u0600-\u06FF]+)/g, `<span style="font-family:${font};">$1</span>`);
}
