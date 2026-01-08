import { apiFetch } from '@/lib/api/client';

export interface QdcAudioTranslatedName {
  name: string;
  language_name?: string | undefined;
}

export interface QdcAudioStyle {
  name: string;
  language_name?: string | undefined;
  description?: string | undefined;
}

export interface QdcAudioQirat {
  name: string;
  language_name?: string | undefined;
}

export interface QdcAudioReciterApi {
  id: number;
  reciter_id: number;
  name: string;
  translated_name?: QdcAudioTranslatedName | undefined;
  style?: QdcAudioStyle | undefined;
  qirat?: QdcAudioQirat | undefined;
}

export interface QdcAudioRecitersResponse {
  reciters: QdcAudioReciterApi[];
}

export type QdcAudioSegment = [word: number, startMs: number, endMs: number];

export interface QdcAudioVerseTimingApi {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  segments?: QdcAudioSegment[] | undefined;
}

export interface QdcAudioFileApi {
  id: number;
  chapter_id: number;
  file_size?: number | undefined;
  format?: string | undefined;
  audio_url: string;
  duration?: number | undefined;
  verse_timings: QdcAudioVerseTimingApi[];
}

export interface QdcAudioFilesResponse {
  audio_files: QdcAudioFileApi[];
}

export interface QdcAudioVerseTiming {
  verseKey: string;
  timestampFrom: number;
  timestampTo: number;
  segments?: QdcAudioSegment[] | undefined;
}

export interface QdcAudioFile {
  id: number;
  chapterId: number;
  audioUrl: string;
  durationMs?: number | undefined;
  verseTimings: QdcAudioVerseTiming[];
}

export function normalizeQdcAudioFile(apiFile: QdcAudioFileApi): QdcAudioFile {
  return {
    id: apiFile.id,
    chapterId: apiFile.chapter_id,
    audioUrl: apiFile.audio_url,
    ...(typeof apiFile.duration === 'number' ? { durationMs: apiFile.duration } : {}),
    verseTimings: apiFile.verse_timings.map((timing) => ({
      verseKey: timing.verse_key,
      timestampFrom: timing.timestamp_from,
      timestampTo: timing.timestamp_to,
      ...(timing.segments ? { segments: timing.segments } : {}),
    })),
  };
}

export async function getQdcAudioReciters(): Promise<QdcAudioReciterApi[]> {
  const json = await apiFetch<QdcAudioRecitersResponse>(
    'audio/reciters',
    {},
    'Failed to fetch QDC audio reciters'
  );
  return Array.isArray(json.reciters) ? json.reciters : [];
}

interface GetQdcAudioFileParams {
  reciterId: number;
  chapterId: number;
  segments?: boolean | undefined;
}

export async function getQdcAudioFile({
  reciterId,
  chapterId,
  segments,
}: GetQdcAudioFileParams): Promise<QdcAudioFile> {
  const params: Record<string, string> = {
    chapter: String(chapterId),
  };
  if (segments) {
    params['segments'] = 'true';
  }

  const json = await apiFetch<QdcAudioFilesResponse>(
    `audio/reciters/${reciterId}/audio_files`,
    params,
    'Failed to fetch QDC surah audio'
  );

  const first = json.audio_files?.[0];
  if (!first) {
    throw new Error('Failed to fetch QDC surah audio: No audio file returned');
  }
  return normalizeQdcAudioFile(first);
}

