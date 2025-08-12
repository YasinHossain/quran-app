export interface Reciter {
  id: number;
  name: string;
  path: string;
  locale?: string;
}

export interface AyahTiming {
  ayah: number;
  start: number;
  duration: number;
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
}

export interface RepeatOptions {
  mode: 'off' | 'single' | 'range' | 'surah';
  start?: number;
  end?: number;
  playCount?: number;
  repeatEach?: number;
  delay?: number;
}
