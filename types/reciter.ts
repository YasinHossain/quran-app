/**
 * Represents a Quran reciter and their audio source.
 */
export interface Reciter {
  /** Unique identifier for the reciter. */
  id: number;
  /** Display name of the reciter. */
  name: string;
  /** Base path to the reciter's audio files. */
  path: string;
  /** Optional locale for the reciter. */
  locale?: string;
}
