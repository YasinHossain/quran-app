export function applyTajweed(text: string): string {
  return text
    .replace(/م/g, '<span class="text-red-600">م</span>')
    .replace(/ن/g, '<span class="text-green-600">ن</span>');
}
