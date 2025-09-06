import { z } from 'zod';

import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Audio configuration segment.
 *
 * Defines defaults for Quran recitation playback.
 */
export const audioSchema = z.object({
  defaultReciter: z.string().default('ar.alafasy'),
  enableAutoplay: z.boolean().default(false),
  enableBackground: z.boolean().default(false),
  bufferSize: z.number().positive().default(4096),
  crossfadeMs: z.number().int().min(0).default(200),
});

export type AudioConfig = z.infer<typeof audioSchema>;

export const audioConfig: AudioConfig = {
  defaultReciter: getEnvVar('NEXT_PUBLIC_DEFAULT_RECITER', 'ar.alafasy')!,
  enableAutoplay: parseBooleanEnv('NEXT_PUBLIC_AUDIO_AUTOPLAY', false),
  enableBackground: parseBooleanEnv('NEXT_PUBLIC_AUDIO_BACKGROUND', false),
  bufferSize: parseNumberEnv('AUDIO_BUFFER_SIZE', 4096)!,
  crossfadeMs: parseNumberEnv('AUDIO_CROSSFADE_MS', 200)!,
};
