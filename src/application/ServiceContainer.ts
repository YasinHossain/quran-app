/**
 * Service Container
 *
 * Dependency injection container for application services.
 * Provides singleton instances of services with proper dependency injection.
 */

import { BookmarkService } from './services/BookmarkService';
import { SettingsService } from './services/SettingsService';
import { AudioService } from './services/AudioService';
import { ThemeService } from './services/ThemeService';
import { BookmarkRepository } from '../infrastructure/repositories/BookmarkRepository';
import { VerseRepository } from '../infrastructure/repositories/VerseRepository';
import { SettingsRepository } from '../infrastructure/repositories/SettingsRepository';
import { AudioRepository } from '../infrastructure/repositories/AudioRepository';
import { ThemeRepository } from '../infrastructure/repositories/ThemeRepository';

export class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  private _bookmarkService: BookmarkService | null = null;
  private _settingsService: SettingsService | null = null;
  private _audioService: AudioService | null = null;
  private _themeService: ThemeService | null = null;
  private _bookmarkRepository: BookmarkRepository | null = null;
  private _verseRepository: VerseRepository | null = null;
  private _settingsRepository: SettingsRepository | null = null;
  private _audioRepository: AudioRepository | null = null;
  private _themeRepository: ThemeRepository | null = null;

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  // Repository instances (singletons)
  get bookmarkRepository(): BookmarkRepository {
    if (!this._bookmarkRepository) {
      this._bookmarkRepository = new BookmarkRepository();
    }
    return this._bookmarkRepository;
  }

  get verseRepository(): VerseRepository {
    if (!this._verseRepository) {
      this._verseRepository = new VerseRepository();
    }
    return this._verseRepository;
  }

  get settingsRepository(): SettingsRepository {
    if (!this._settingsRepository) {
      this._settingsRepository = new SettingsRepository();
    }
    return this._settingsRepository;
  }

  get audioRepository(): AudioRepository {
    if (!this._audioRepository) {
      this._audioRepository = new AudioRepository();
    }
    return this._audioRepository;
  }

  get themeRepository(): ThemeRepository {
    if (!this._themeRepository) {
      this._themeRepository = new ThemeRepository();
    }
    return this._themeRepository;
  }

  // Service instances (singletons)
  get bookmarkService(): BookmarkService {
    if (!this._bookmarkService) {
      this._bookmarkService = new BookmarkService(this.bookmarkRepository, this.verseRepository, {
        defaultTranslationId: 20,
        fetchMetadataByDefault: true,
      });
    }
    return this._bookmarkService;
  }

  get settingsService(): SettingsService {
    if (!this._settingsService) {
      this._settingsService = new SettingsService(this.settingsRepository, {
        autoSave: true,
        validateOnUpdate: true,
      });
    }
    return this._settingsService;
  }

  get audioService(): AudioService {
    if (!this._audioService) {
      this._audioService = new AudioService(this.audioRepository, {
        autoSave: true,
        validateOnUpdate: true,
      });
    }
    return this._audioService;
  }

  get themeService(): ThemeService {
    if (!this._themeService) {
      this._themeService = new ThemeService(this.themeRepository, {
        autoSave: true,
        validateOnUpdate: true,
        updateDOM: true,
      });
    }
    return this._themeService;
  }

  // Method to reset all services (useful for testing)
  reset(): void {
    this._bookmarkService?.destroy?.();
    this._bookmarkService?.dispose?.();
    this._bookmarkService = null;

    this._settingsService?.destroy?.();
    this._settingsService?.dispose?.();
    this._settingsService = null;

    this._audioService?.destroy?.();
    this._audioService?.dispose?.();
    this._audioService = null;

    this._themeService?.destroy?.();
    this._themeService?.dispose?.();
    this._themeService = null;

    this._bookmarkRepository?.destroy?.();
    this._bookmarkRepository?.dispose?.();
    this._bookmarkRepository = null;

    this._verseRepository?.destroy?.();
    this._verseRepository?.dispose?.();
    this._verseRepository = null;

    this._settingsRepository?.destroy?.();
    this._settingsRepository?.dispose?.();
    this._settingsRepository = null;

    this._audioRepository?.destroy?.();
    this._audioRepository?.dispose?.();
    this._audioRepository = null;

    this._themeRepository?.destroy?.();
    this._themeRepository?.dispose?.();
    this._themeRepository = null;
  }

  // Destroy current instance (useful for hot reloads/tests)
  static destroy(): void {
    if (ServiceContainer.instance) {
      ServiceContainer.instance.reset();
      ServiceContainer.instance = null;
    }
  }
}

// Convenience function to get services
export const getServices = () => ServiceContainer.getInstance();
// Helper to destroy and reset services
export const destroyServices = () => ServiceContainer.destroy();
