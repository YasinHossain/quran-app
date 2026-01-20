import useSWR from 'swr';

import { getQdcAudioFile } from '@/lib/audio/qdcAudio';

import type { QdcAudioFile } from '@/lib/audio/qdcAudio';

type Key = readonly ['qdc-audio-file', number, number, boolean];

const buildKey = (
  reciterId: number | null,
  chapterId: number | null,
  segments: boolean
): Key | null => {
  if (typeof reciterId !== 'number' || !Number.isFinite(reciterId)) return null;
  if (typeof chapterId !== 'number' || !Number.isFinite(chapterId) || chapterId <= 0) return null;
  return ['qdc-audio-file', reciterId, chapterId, segments] as const;
};

export function useQdcAudioFile(
  reciterId: number | null,
  chapterId: number | null,
  segments: boolean
): { audioFile: QdcAudioFile | undefined; isLoading: boolean; error: Error | undefined } {
  const key = buildKey(reciterId, chapterId, segments);
  const fetcher = ([, rId, cId, withSegments]: Key): Promise<QdcAudioFile> =>
    getQdcAudioFile({ reciterId: rId, chapterId: cId, segments: withSegments });
  const { data, error, isLoading } = useSWR<QdcAudioFile>(key, fetcher);
  return {
    audioFile: data,
    isLoading: Boolean(isLoading && !data),
    error: error as Error | undefined,
  };
}
