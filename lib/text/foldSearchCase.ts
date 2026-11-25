/**
 * Case-folds text for substring search across languages. Plain `toLowerCase()` turns the Turkish
 * capital `İ` (which Turkish keyboards auto-capitalize from `i`) into `i` + U+0307, so `İnsan`
 * never matches `Al-Insan`; this folds that and the dotless `ı` to a plain `i`. Apply it to both
 * the query and the text being searched.
 */
export function foldSearchCase(value: string): string {
  return value.toLowerCase().replace(/̇/g, '').replace(/ı/g, 'i');
}
