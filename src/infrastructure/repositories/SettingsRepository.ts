/**
 * Infrastructure: SettingsRepository
 *
 * Implements ISettingsRepository using localStorage with debouncing and versioning.
 */

import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { Settings, SettingsStorageData } from '../../domain/entities/Settings';

const STORAGE_KEY = 'quran-app-settings';
const VERSION_KEY = 'quran-app-settings-version';
const CURRENT_VERSION = '1.0';

export class SettingsRepository implements ISettingsRepository {
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_MS = 300;

  async loadSettings(): Promise<Settings> {
    try {
      // Check version compatibility
      const version = localStorage.getItem(VERSION_KEY);
      if (version && version !== CURRENT_VERSION) {
        await this.migrateSettings(version, CURRENT_VERSION);
      }

      const settingsData = localStorage.getItem(STORAGE_KEY);
      if (!settingsData) {
        return this.getDefaultSettings();
      }

      const parsed: SettingsStorageData = JSON.parse(settingsData);
      return Settings.fromStorage(parsed);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings: Settings): Promise<void> {
    // Debounce saves to avoid excessive localStorage writes
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      try {
        const storageData = settings.toStorage();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }, this.DEBOUNCE_MS);
  }

  getDefaultSettings(): Settings {
    return Settings.createDefault();
  }

  async resetToDefaults(): Promise<void> {
    const defaultSettings = this.getDefaultSettings();

    // Clear debounce timer and save immediately
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }

  async hasStoredSettings(): Promise<boolean> {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  async getStorageSize(): Promise<number> {
    try {
      const settingsData = localStorage.getItem(STORAGE_KEY) || '';
      const versionData = localStorage.getItem(VERSION_KEY) || '';
      return settingsData.length + versionData.length;
    } catch (error) {
      return 0;
    }
  }

  async exportSettings(): Promise<{
    settings: SettingsStorageData;
    exportedAt: string;
    version: string;
  }> {
    const settings = await this.loadSettings();
    return {
      settings: settings.toStorage(),
      exportedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
  }

  async importSettings(data: {
    settings: SettingsStorageData;
    exportedAt: string;
    version: string;
  }): Promise<void> {
    try {
      // Validate import data
      if (!data.settings || !data.version) {
        throw new Error('Invalid import data');
      }

      // Handle version compatibility
      let settingsData = data.settings;
      if (data.version !== CURRENT_VERSION) {
        settingsData = await this.migrateSettingsData(data.settings, data.version, CURRENT_VERSION);
      }

      // Create settings instance to validate
      const settings = Settings.fromStorage(settingsData);
      if (!settings.isValid()) {
        throw new Error('Invalid settings data');
      }

      // Save imported settings
      await this.saveSettings(settings);
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw error;
    }
  }

  // Private methods
  private async migrateSettings(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating settings from ${fromVersion} to ${toVersion}`);

    try {
      const settingsData = localStorage.getItem(STORAGE_KEY);
      if (!settingsData) return;

      const parsed = JSON.parse(settingsData);
      const migratedData = await this.migrateSettingsData(parsed, fromVersion, toVersion);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
      localStorage.setItem(VERSION_KEY, toVersion);
    } catch (error) {
      console.error('Settings migration failed:', error);
      // Fall back to defaults on migration failure
      await this.resetToDefaults();
    }
  }

  private async migrateSettingsData(
    data: unknown,
    fromVersion: string,
    toVersion: string
  ): Promise<SettingsStorageData> {
    // Handle migration between different versions
    // For now, just return data as-is since we're on v1.0
    // Future versions would implement actual migration logic

    // Type guard for legacy data
    const legacyData = data as Record<string, unknown>;

    const migrated: SettingsStorageData = {
      translationIds: Array.isArray(legacyData.translationIds)
        ? (legacyData.translationIds as number[])
        : typeof legacyData.translationId === 'number'
          ? [legacyData.translationId]
          : [20],
      tafsirIds: Array.isArray(legacyData.tafsirIds)
        ? (legacyData.tafsirIds as number[])
        : typeof legacyData.tafsirId === 'number'
          ? [legacyData.tafsirId]
          : [169],
      arabicFont:
        typeof legacyData.arabicFont === 'string' ? legacyData.arabicFont : 'uthmanic-hafs',
      fontSize: typeof legacyData.fontSize === 'number' ? legacyData.fontSize : 16,
      showByWords: typeof legacyData.showByWords === 'boolean' ? legacyData.showByWords : false,
      tajweed: typeof legacyData.tajweed === 'boolean' ? legacyData.tajweed : true,
      wordLang: typeof legacyData.wordLang === 'string' ? legacyData.wordLang : 'en',
      wordTranslationId:
        typeof legacyData.wordTranslationId === 'number' ? legacyData.wordTranslationId : 20,
      theme:
        legacyData.theme === 'light' || legacyData.theme === 'dark' || legacyData.theme === 'system'
          ? legacyData.theme
          : 'system',
    };

    return migrated;
  }
}
