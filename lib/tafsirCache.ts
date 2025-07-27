import { getTafsirByVerse } from './api';

const cache: Record<string, Promise<string>> = {};

export function getTafsirCached(verseKey: string, tafsirId = 169): Promise<string> {
  const key = `${tafsirId}-${verseKey}`;
  if (!cache[key]) {
    cache[key] = getTafsirByVerse(verseKey, tafsirId);
  }
  return cache[key];
}
