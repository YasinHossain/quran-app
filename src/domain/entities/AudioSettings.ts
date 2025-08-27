/**
 * Audio Settings Domain Entity
 *
 * Represents audio-related user preferences and settings.
 * Immutable entity with business logic for audio configuration.
 */

export interface RepeatOptions {
  mode: 'off' | 'verse' | 'range';
  start: number;
  end: number;
  playCount: number;
  repeatEach: number;
  delay: number;
}

export interface Reciter {
  id: number;
  name: string;
  style: string;
  subfolder: string;
  chapter_count: number;
}

export interface AudioSettingsStorageData {
  reciterId: number;
  volume: number;
  playbackRate: number;
  repeatOptions: RepeatOptions;
  lastPlayingId?: number;
  version?: number;
}

export class AudioSettings {
  constructor(
    public readonly reciterId: number,
    public readonly volume: number,
    public readonly playbackRate: number,
    public readonly repeatOptions: RepeatOptions,
    public readonly lastPlayingId?: number
  ) {
    if (volume < 0 || volume > 1) {
      throw new Error('Volume must be between 0 and 1');
    }
    if (playbackRate <= 0) {
      throw new Error('Playback rate must be greater than 0');
    }
    if (repeatOptions.playCount < 1) {
      throw new Error('Play count must be at least 1');
    }
    if (repeatOptions.repeatEach < 1) {
      throw new Error('Repeat each must be at least 1');
    }
    if (repeatOptions.delay < 0) {
      throw new Error('Delay must be non-negative');
    }
  }

  static create(data: Partial<AudioSettingsStorageData> = {}): AudioSettings {
    const defaultRepeatOptions: RepeatOptions = {
      mode: 'off',
      start: 1,
      end: 1,
      playCount: 1,
      repeatEach: 1,
      delay: 0,
    };

    return new AudioSettings(
      data.reciterId ?? 7, // Default reciter
      data.volume ?? 0.9,
      data.playbackRate ?? 1,
      data.repeatOptions ?? defaultRepeatOptions,
      data.lastPlayingId
    );
  }

  static fromStorage(data: AudioSettingsStorageData): AudioSettings {
    return new AudioSettings(
      data.reciterId,
      data.volume,
      data.playbackRate,
      data.repeatOptions,
      data.lastPlayingId
    );
  }

  withReciter(reciterId: number): AudioSettings {
    return new AudioSettings(
      reciterId,
      this.volume,
      this.playbackRate,
      this.repeatOptions,
      this.lastPlayingId
    );
  }

  withVolume(volume: number): AudioSettings {
    if (volume < 0 || volume > 1) {
      throw new Error('Volume must be between 0 and 1');
    }
    return new AudioSettings(
      this.reciterId,
      volume,
      this.playbackRate,
      this.repeatOptions,
      this.lastPlayingId
    );
  }

  withPlaybackRate(rate: number): AudioSettings {
    if (rate <= 0) {
      throw new Error('Playback rate must be greater than 0');
    }
    return new AudioSettings(
      this.reciterId,
      this.volume,
      rate,
      this.repeatOptions,
      this.lastPlayingId
    );
  }

  withRepeatOptions(options: RepeatOptions): AudioSettings {
    if (options.playCount < 1) {
      throw new Error('Play count must be at least 1');
    }
    if (options.repeatEach < 1) {
      throw new Error('Repeat each must be at least 1');
    }
    if (options.delay < 0) {
      throw new Error('Delay must be non-negative');
    }
    return new AudioSettings(
      this.reciterId,
      this.volume,
      this.playbackRate,
      options,
      this.lastPlayingId
    );
  }

  withLastPlayingId(id: number | undefined): AudioSettings {
    return new AudioSettings(
      this.reciterId,
      this.volume,
      this.playbackRate,
      this.repeatOptions,
      id
    );
  }

  isValid(): boolean {
    try {
      return (
        this.volume >= 0 &&
        this.volume <= 1 &&
        this.playbackRate > 0 &&
        this.repeatOptions.playCount >= 1 &&
        this.repeatOptions.repeatEach >= 1 &&
        this.repeatOptions.delay >= 0
      );
    } catch {
      return false;
    }
  }

  toStorageData(): AudioSettingsStorageData {
    return {
      reciterId: this.reciterId,
      volume: this.volume,
      playbackRate: this.playbackRate,
      repeatOptions: this.repeatOptions,
      lastPlayingId: this.lastPlayingId,
      version: 1,
    };
  }
}
