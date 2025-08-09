export interface Reciter {
  id: number;
  name: string;
  path: string;
}

export interface AyahTiming {
  ayah: number;
  start: number;
  duration: number;
}

export interface Track {
  id: string;
  url: string;
  title?: string;
  reciter?: Reciter;
  timings?: AyahTiming[];
}

export interface RepeatOptions {
  mode: 'none' | 'single' | 'range';
  start: number;
  end: number;
  repeatEach: number;
  playCount: number;
  delay: number;
}

export interface PlayerState {
  track: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  repeat: RepeatOptions;
}
