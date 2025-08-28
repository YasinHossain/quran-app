/**
 * Application Service: SettingsService
 *
 * Orchestrates settings-related operations and provides a clean API for React components.
 */

import {
  ISettingsRepository,
  SettingsStorageData,
} from '../../domain/repositories/ISettingsRepository';
import { Settings, ArabicFont } from '../../domain/entities/Settings';

export interface SettingsServiceConfig {
  autoSave?: boolean;
  validateOnUpdate?: boolean;
}

export class SettingsService {
  private currentSettings: Settings;
  private config: Required<SettingsServiceConfig>;
  private initialized = false;

  constructor(
    private settingsRepository: ISettingsRepository,
    config: SettingsServiceConfig = {}
  ) {
    this.config = {
      autoSave: true,
      validateOnUpdate: true,
      ...config,
    };

    this.currentSettings = this.settingsRepository.getDefaultSettings();
  }

  // Initialization
  async initialize(): Promise<Settings> {
    if (this.initialized) return this.currentSettings;

    try {
      this.currentSettings = await this.settingsRepository.loadSettings();
      this.initialized = true;
      return this.currentSettings;
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      this.currentSettings = this.settingsRepository.getDefaultSettings();
      this.initialized = true;
      return this.currentSettings;
    }
  }

  // Getters
  getCurrentSettings(): Settings {
    return this.currentSettings;
  }

  async getSettings(): Promise<Settings> {
    if (!this.initialized) {
      return await this.initialize();
    }
    return this.currentSettings;
  }

  // Translation settings
  async setTranslationIds(translationIds: number[]): Promise<void> {
    await this.ensureInitialized();

    if (this.config.validateOnUpdate && translationIds.length === 0) {
      throw new Error('At least one translation is required');
    }

    this.currentSettings = this.currentSettings.withTranslationIds(translationIds);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async addTranslation(translationId: number): Promise<void> {
    await this.ensureInitialized();

    const currentIds = this.currentSettings.translationIds;
    if (!currentIds.includes(translationId)) {
      const newIds = [...currentIds, translationId];
      await this.setTranslationIds(newIds);
    }
  }

  async removeTranslation(translationId: number): Promise<void> {
    await this.ensureInitialized();

    const currentIds = this.currentSettings.translationIds;
    if (currentIds.length <= 1) {
      throw new Error('Cannot remove the last translation');
    }

    const newIds = currentIds.filter((id) => id !== translationId);
    await this.setTranslationIds(newIds);
  }

  // Tafsir settings
  async setTafsirIds(tafsirIds: number[]): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withTafsirIds(tafsirIds);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async addTafsir(tafsirId: number): Promise<void> {
    await this.ensureInitialized();

    const currentIds = this.currentSettings.tafsirIds;
    if (!currentIds.includes(tafsirId)) {
      const newIds = [...currentIds, tafsirId];
      await this.setTafsirIds(newIds);
    }
  }

  async removeTafsir(tafsirId: number): Promise<void> {
    await this.ensureInitialized();

    const currentIds = this.currentSettings.tafsirIds;
    const newIds = currentIds.filter((id) => id !== tafsirId);
    await this.setTafsirIds(newIds);
  }

  // Display settings
  async setArabicFont(arabicFont: string): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withArabicFont(arabicFont);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async setFontSize(fontSize: number): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withArabicFontSize(fontSize);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async increaseFontSize(): Promise<void> {
    await this.ensureInitialized();
    const current = this.currentSettings.arabicFontSize;
    const newSize = Math.min(48, current + 1);
    await this.setFontSize(newSize);
  }

  async decreaseFontSize(): Promise<void> {
    await this.ensureInitialized();
    const current = this.currentSettings.arabicFontSize;
    const newSize = Math.max(16, current - 1);
    await this.setFontSize(newSize);
  }

  // Reading preferences
  async setShowByWords(showByWords: boolean): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withShowByWords(showByWords);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async toggleShowByWords(): Promise<boolean> {
    await this.ensureInitialized();
    const newValue = !this.currentSettings.showByWords;
    await this.setShowByWords(newValue);
    return newValue;
  }

  async setTajweed(tajweed: boolean): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withTajweed(tajweed);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async toggleTajweed(): Promise<boolean> {
    await this.ensureInitialized();
    const newValue = !this.currentSettings.tajweed;
    await this.setTajweed(newValue);
    return newValue;
  }

  // Word translation settings
  async setWordLang(wordLang: string): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withWordLang(wordLang);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  async setWordTranslationId(wordTranslationId: number): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withWordTranslationId(wordTranslationId);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  // Theme settings
  async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await this.ensureInitialized();

    this.currentSettings = this.currentSettings.withTheme(theme);

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  // Bulk updates
  async updateSettings(
    updates: Partial<{
      translationIds: number[];
      tafsirIds: number[];
      arabicFont: string;
      fontSize: number;
      arabicFontSize: number;
      translationFontSize: number;
      tafsirFontSize: number;
      showByWords: boolean;
      tajweed: boolean;
      wordLang: string;
      wordTranslationId: number;
      theme: 'light' | 'dark' | 'system';
    }>
  ): Promise<void> {
    await this.ensureInitialized();

    let settings = this.currentSettings;

    if (updates.translationIds !== undefined) {
      settings = settings.withTranslationIds(updates.translationIds);
    }
    if (updates.tafsirIds !== undefined) {
      settings = settings.withTafsirIds(updates.tafsirIds);
    }
    if (updates.arabicFont !== undefined) {
      settings = settings.withArabicFont(updates.arabicFont);
    }
    if (updates.fontSize !== undefined) {
      settings = settings.withFontSize(updates.fontSize);
    }
    if (updates.arabicFontSize !== undefined) {
      settings = settings.withArabicFontSize(updates.arabicFontSize);
    }
    if (updates.translationFontSize !== undefined) {
      settings = settings.withTranslationFontSize(updates.translationFontSize);
    }
    if (updates.tafsirFontSize !== undefined) {
      settings = settings.withTafsirFontSize(updates.tafsirFontSize);
    }
    if (updates.showByWords !== undefined) {
      settings = settings.withShowByWords(updates.showByWords);
    }
    if (updates.tajweed !== undefined) {
      settings = settings.withTajweed(updates.tajweed);
    }
    if (updates.wordLang !== undefined) {
      settings = settings.withWordLang(updates.wordLang);
    }
    if (updates.wordTranslationId !== undefined) {
      settings = settings.withWordTranslationId(updates.wordTranslationId);
    }
    if (updates.theme !== undefined) {
      settings = settings.withTheme(updates.theme);
    }

    this.currentSettings = settings;

    if (this.config.autoSave) {
      await this.settingsRepository.saveSettings(this.currentSettings);
    }
  }

  // Persistence operations
  async saveSettings(): Promise<void> {
    await this.ensureInitialized();
    await this.settingsRepository.saveSettings(this.currentSettings);
  }

  async resetToDefaults(): Promise<void> {
    await this.settingsRepository.resetToDefaults();
    this.currentSettings = this.settingsRepository.getDefaultSettings();
  }

  // Import/Export
  async exportSettings(): Promise<{
    settings: SettingsStorageData;
    exportedAt: string;
    version: string;
  }> {
    return await this.settingsRepository.exportSettings();
  }

  async importSettings(data: {
    settings: SettingsStorageData;
    exportedAt: string;
    version: string;
  }): Promise<void> {
    await this.settingsRepository.importSettings(data);
    this.currentSettings = await this.settingsRepository.loadSettings();
  }

  // Utility methods
  async getAvailableArabicFonts(): Promise<ArabicFont[]> {
    // This would typically come from a configuration or API
    return [
      { name: 'Uthmanic Hafs', value: 'uthmanic-hafs', category: 'classical' },
      { name: 'Amiri', value: 'amiri', category: 'modern' },
      { name: 'Lateef', value: 'lateef', category: 'modern' },
      { name: 'Scheherazade New', value: 'scheherazade-new', category: 'modern' },
      { name: 'Noor e Hira', value: 'noor-e-hira', category: 'decorative' },
      { name: 'Uthman Taha', value: 'uthman-taha', category: 'classical' },
    ];
  }

  async getStorageInfo(): Promise<{
    hasStoredSettings: boolean;
    storageSize: number;
    isValid: boolean;
  }> {
    await this.ensureInitialized();

    return {
      hasStoredSettings: await this.settingsRepository.hasStoredSettings(),
      storageSize: await this.settingsRepository.getStorageSize(),
      isValid: this.currentSettings.isValid(),
    };
  }

  // Private methods
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}
