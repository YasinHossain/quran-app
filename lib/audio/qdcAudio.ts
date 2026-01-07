import { fetchWithTimeout } from '@/lib/api/client';

const QDC_AUDIO_BASE_URL =
  process.env['NEXT_PUBLIC_QDC_AUDIO_BASE_URL'] ?? 'https://api.quran.com/api/qdc/audio';

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

function normaliseBaseUrl(raw: string): string {
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
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
  const url = `${normaliseBaseUrl(QDC_AUDIO_BASE_URL)}/reciters`;
  const res = await fetchWithTimeout(url, {
    headers: { Accept: 'application/json' },
    errorPrefix: 'Failed to fetch QDC audio reciters',
  });
  const json = (await res.json()) as QdcAudioRecitersResponse;
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
  const url = new URL(`${normaliseBaseUrl(QDC_AUDIO_BASE_URL)}/reciters/${reciterId}/audio_files`);
  url.searchParams.set('chapter', String(chapterId));
  if (segments) {
    url.searchParams.set('segments', 'true');
  }

  const res = await fetchWithTimeout(url.toString(), {
    headers: { Accept: 'application/json' },
    errorPrefix: 'Failed to fetch QDC surah audio',
  });
  const json = (await res.json()) as QdcAudioFilesResponse;
  const first = json.audio_files?.[0];
  if (!first) {
    throw new Error('Failed to fetch QDC surah audio: No audio file returned');
  }
  return normalizeQdcAudioFile(first);
}
