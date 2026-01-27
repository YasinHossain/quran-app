/**
 * Creates a stable comma-separated string of translation IDs for caching
 */
export function getStableTranslationIds(
  translationIds: number[] | undefined,
  fallbackId: number | undefined
): string {
  const ids = translationIds || [fallbackId];
  const validIds = ids.filter((tid): tid is number => !!tid && typeof tid === 'number');
  return validIds.length > 0 ? validIds.sort((a, b) => a - b).join(',') : '20';
}
