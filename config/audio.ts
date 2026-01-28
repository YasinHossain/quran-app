import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Audio configuration segment.
 *
 * Defines defaults for Quran recitation playback.
 */
export interface AudioConfig {
  defaultReciter: string;
  enableAutoplay: boolean;
  enableBackground: boolean;
  bufferSize: number;
  crossfadeMs: number;
}

const resolvePositiveNumber = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

const resolveNonNegativeInt = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.trunc(value));
};

export const audioConfig: AudioConfig = {
  defaultReciter: getEnvVar('NEXT_PUBLIC_DEFAULT_RECITER', 'ar.alafasy') ?? 'ar.alafasy',
  enableAutoplay: parseBooleanEnv('NEXT_PUBLIC_AUDIO_AUTOPLAY', false),
  enableBackground: parseBooleanEnv('NEXT_PUBLIC_AUDIO_BACKGROUND', false),
  bufferSize: resolvePositiveNumber(parseNumberEnv('AUDIO_BUFFER_SIZE', 4096), 4096),
  crossfadeMs: resolveNonNegativeInt(parseNumberEnv('AUDIO_CROSSFADE_MS', 200), 200),
};
