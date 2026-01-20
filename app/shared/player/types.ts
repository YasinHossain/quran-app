export interface Reciter {
  id: number;
  name: string;
  locale?: string;
}

export interface AyahTiming {
  ayah: number;
  start: number;
  duration: number;
}

export interface WordSegmentTiming {
  word: number;
  start: number;
  end: number;
}

export interface Track {
  id: string;
  src: string;
  title?: string;
  artist?: string;
  coverUrl?: string;
  durationSec?: number;
  reciter?: Reciter;
  timings?: AyahTiming[];
  segmentStartSec?: number;
  segmentEndSec?: number;
  wordSegments?: WordSegmentTiming[];
}

export interface RepeatOptions {
  mode: 'off' | 'single' | 'range' | 'surah';
  start?: number | undefined;
  end?: number | undefined;
  surahId?: number | undefined;
  verseNumber?: number | undefined;
  startSurahId?: number | undefined;
  startVerseNumber?: number | undefined;
  endSurahId?: number | undefined;
  endVerseNumber?: number | undefined;
  rangeSize?: number | undefined;
  playCount?: number | undefined;
  repeatEach?: number | undefined;
  delay?: number | undefined;
}
