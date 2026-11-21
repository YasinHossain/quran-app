import { unstable_cache } from 'next/cache';

import { apiFetch } from '@/lib/api/client';
import { logger } from '@/src/infrastructure/monitoring/Logger';

/**
 * Whole-surah recitation for the surah overview page: the audio file and its length. Uses the
 * site's default reciter so the page and the reader's player play the same recording.
 */

export interface SurahRecitation {
  reciterId: number;
  audioUrl: string;
  durationMs: number;
}

interface AudioFilesResponse {
  audio_files?: Array<{ audio_url?: string; duration?: number | null }>;
}

const fetchRecitation = async (reciterId: number, chapterId: number): Promise<SurahRecitation> => {
  const json = await apiFetch<AudioFilesResponse>(
    `audio/reciters/${reciterId}/audio_files`,
    { chapter: String(chapterId) },
    'Failed to fetch surah recitation'
  );
  const file = json.audio_files?.[0];
  if (!file?.audio_url || typeof file.duration !== 'number' || file.duration <= 0) {
    throw new Error(`No recitation with a duration for reciter ${reciterId}, surah ${chapterId}`);
  }
  return { reciterId, audioUrl: file.audio_url, durationMs: file.duration };
};

const getRecitationCached = unstable_cache(fetchRecitation, ['surah-about:recitation:v1'], {
  revalidate: 86400,
  tags: ['surah-recitation'],
});

/** `undefined` when the audio service has no usable file (the page then leaves the tile out). */
export async function getSurahRecitationServer(
  reciterId: number,
  chapterId: number
): Promise<SurahRecitation | undefined> {
  try {
    return await getRecitationCached(reciterId, chapterId);
  } catch (error) {
    logger.warn('Surah recitation unavailable', { reciterId, chapterId }, error as Error);
    return undefined;
  }
}
