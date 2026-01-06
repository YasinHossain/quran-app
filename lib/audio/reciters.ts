// This file is kept for backward compatibility but is no longer used.
// All reciters are now fetched from the QDC API.
// See: app/shared/player/hooks/useReciters.ts

import type { Reciter } from '@/app/shared/player/types';

/**
 * @deprecated Use useReciters() hook instead which fetches from QDC API
 */
export const RECITERS: Reciter[] = [];

/**
 * @deprecated No longer needed - all audio is served via QDC API
 */
export function buildAudioUrl(_verseKey: string, _reciterPath: string): string {
  throw new Error('buildAudioUrl is deprecated. Use QDC API instead.');
}
