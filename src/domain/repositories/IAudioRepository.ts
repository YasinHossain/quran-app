/**
 * Audio Repository Interface
 *
 * Contract for audio settings persistence operations.
 */

import { AudioSettings } from '../entities/AudioSettings';

export interface IAudioRepository {
  getAudioSettings(): Promise<AudioSettings>;
  saveAudioSettings(settings: AudioSettings): Promise<void>;
  clearAudioSettings(): Promise<void>;
}
