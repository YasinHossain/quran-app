/**
 * Audio Repository Implementation
 *
 * localStorage-based implementation for audio settings persistence.
 */

import { IAudioRepository } from '../../domain/repositories/IAudioRepository';
import { AudioSettings, AudioSettingsStorageData } from '../../domain/entities/AudioSettings';

export class AudioRepository implements IAudioRepository {
  private readonly STORAGE_KEY = 'quran-audio-settings';
  private readonly STORAGE_VERSION = 1;

  async getAudioSettings(): Promise<AudioSettings> {
    try {
      if (typeof window === 'undefined') {
        return AudioSettings.create();
      }

      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return AudioSettings.create();
      }

      const data = JSON.parse(stored) as AudioSettingsStorageData;

      // Handle version migrations if needed
      if (!data.version || data.version < this.STORAGE_VERSION) {
        const migrated = await this.migrateData(data);
        await this.saveAudioSettings(migrated);
        return migrated;
      }

      return AudioSettings.fromStorage(data);
    } catch (error) {
      console.warn('Failed to load audio settings from storage:', error);
      return AudioSettings.create();
    }
  }

  async saveAudioSettings(settings: AudioSettings): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      const data = settings.toStorageData();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save audio settings to storage:', error);
      throw new Error('Failed to save audio settings');
    }
  }

  async clearAudioSettings(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear audio settings from storage:', error);
    }
  }

  private async migrateData(oldData: unknown): Promise<AudioSettings> {
    // Handle migration from legacy localStorage keys
    try {
      if (typeof window === 'undefined') {
        return AudioSettings.create();
      }

      const reciterId = localStorage.getItem('reciterId');
      const volume = localStorage.getItem('volume');
      const playbackRate = localStorage.getItem('playbackRate');

      const migrationData: Partial<AudioSettingsStorageData> = {};

      if (reciterId) {
        const parsed = Number.parseInt(reciterId, 10);
        if (!Number.isNaN(parsed)) {
          migrationData.reciterId = parsed;
          localStorage.removeItem('reciterId');
        }
      }

      if (volume) {
        const parsed = Number.parseFloat(volume);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          migrationData.volume = parsed;
          localStorage.removeItem('volume');
        }
      }

      if (playbackRate) {
        const parsed = Number.parseFloat(playbackRate);
        if (!Number.isNaN(parsed) && parsed > 0) {
          migrationData.playbackRate = parsed;
          localStorage.removeItem('playbackRate');
        }
      }

      return AudioSettings.create(migrationData);
    } catch {
      return AudioSettings.create();
    }
  }
}
