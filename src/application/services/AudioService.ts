/**
 * Audio Service
 *
 * Application service for managing audio playback and settings.
 */

import { IAudioRepository } from '../../domain/repositories/IAudioRepository';
import { AudioSettings, RepeatOptions, Reciter } from '../../domain/entities/AudioSettings';

export interface AudioServiceConfig {
  autoSave?: boolean;
  validateOnUpdate?: boolean;
}

export class AudioService {
  private audioSettings: AudioSettings | null = null;

  constructor(
    private readonly audioRepository: IAudioRepository,
    private readonly config: AudioServiceConfig = {}
  ) {
    this.config = {
      autoSave: true,
      validateOnUpdate: true,
      ...config,
    };
  }

  async getAudioSettings(): Promise<AudioSettings> {
    if (!this.audioSettings) {
      this.audioSettings = await this.audioRepository.getAudioSettings();
    }
    return this.audioSettings;
  }

  async setReciter(reciterId: number): Promise<void> {
    const currentSettings = await this.getAudioSettings();
    const newSettings = currentSettings.withReciter(reciterId);

    if (this.config.validateOnUpdate && !newSettings.isValid()) {
      throw new Error('Invalid reciter settings');
    }

    this.audioSettings = newSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(newSettings);
    }
  }

  async setVolume(volume: number): Promise<void> {
    const currentSettings = await this.getAudioSettings();
    const newSettings = currentSettings.withVolume(volume);

    if (this.config.validateOnUpdate && !newSettings.isValid()) {
      throw new Error('Invalid volume settings');
    }

    this.audioSettings = newSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(newSettings);
    }
  }

  async setPlaybackRate(rate: number): Promise<void> {
    const currentSettings = await this.getAudioSettings();
    const newSettings = currentSettings.withPlaybackRate(rate);

    if (this.config.validateOnUpdate && !newSettings.isValid()) {
      throw new Error('Invalid playback rate settings');
    }

    this.audioSettings = newSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(newSettings);
    }
  }

  async setRepeatOptions(options: RepeatOptions): Promise<void> {
    const currentSettings = await this.getAudioSettings();
    const newSettings = currentSettings.withRepeatOptions(options);

    if (this.config.validateOnUpdate && !newSettings.isValid()) {
      throw new Error('Invalid repeat options');
    }

    this.audioSettings = newSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(newSettings);
    }
  }

  async setLastPlayingId(id: number | undefined): Promise<void> {
    const currentSettings = await this.getAudioSettings();
    const newSettings = currentSettings.withLastPlayingId(id);

    this.audioSettings = newSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(newSettings);
    }
  }

  async updateAudioSettings(
    updates: Partial<{
      reciterId: number;
      volume: number;
      playbackRate: number;
      repeatOptions: RepeatOptions;
      lastPlayingId: number | undefined;
    }>
  ): Promise<void> {
    let currentSettings = await this.getAudioSettings();

    if (updates.reciterId !== undefined) {
      currentSettings = currentSettings.withReciter(updates.reciterId);
    }
    if (updates.volume !== undefined) {
      currentSettings = currentSettings.withVolume(updates.volume);
    }
    if (updates.playbackRate !== undefined) {
      currentSettings = currentSettings.withPlaybackRate(updates.playbackRate);
    }
    if (updates.repeatOptions !== undefined) {
      currentSettings = currentSettings.withRepeatOptions(updates.repeatOptions);
    }
    if (updates.lastPlayingId !== undefined) {
      currentSettings = currentSettings.withLastPlayingId(updates.lastPlayingId);
    }

    if (this.config.validateOnUpdate && !currentSettings.isValid()) {
      throw new Error('Invalid audio settings update');
    }

    this.audioSettings = currentSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(currentSettings);
    }
  }

  async resetToDefaults(): Promise<void> {
    const defaultSettings = AudioSettings.create();
    this.audioSettings = defaultSettings;

    if (this.config.autoSave) {
      await this.audioRepository.saveAudioSettings(defaultSettings);
    }
  }

  async clearSettings(): Promise<void> {
    this.audioSettings = null;
    await this.audioRepository.clearAudioSettings();
  }

  // Utility methods
  async getCurrentReciterId(): Promise<number> {
    const settings = await this.getAudioSettings();
    return settings.reciterId;
  }

  async getCurrentVolume(): Promise<number> {
    const settings = await this.getAudioSettings();
    return settings.volume;
  }

  async getCurrentPlaybackRate(): Promise<number> {
    const settings = await this.getAudioSettings();
    return settings.playbackRate;
  }

  async getCurrentRepeatOptions(): Promise<RepeatOptions> {
    const settings = await this.getAudioSettings();
    return settings.repeatOptions;
  }

  async getLastPlayingId(): Promise<number | undefined> {
    const settings = await this.getAudioSettings();
    return settings.lastPlayingId;
  }
}
