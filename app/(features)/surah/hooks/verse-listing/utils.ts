/**
 * Creates a stable comma-separated string of translation IDs for caching
 */
export function getStableTranslationIds(
  translationIds: number[] | undefined,
  fallbackId: number | undefined
): string {
  if (Array.isArray(translationIds)) {
    // An explicit empty array means "no translations selected" (e.g., Arabic UI default).
    if (translationIds.length === 0) return '';

    const validIds = translationIds.filter((id): id is number => Number.isFinite(id));
    if (validIds.length > 0) {
      return validIds.sort((a, b) => a - b).join(',');
    }
  }

  const fallback =
    typeof fallbackId === 'number' && Number.isFinite(fallbackId) ? String(fallbackId) : '20';
  return fallback;
}
