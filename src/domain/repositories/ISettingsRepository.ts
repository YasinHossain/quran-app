/**
 * Repository Interface: ISettingsRepository
 *
 * Defines the contract for settings data persistence and retrieval.
 */

import { Settings, SettingsStorageData } from '../entities/Settings';

export interface ISettingsRepository {
  /**
   * Load settings from storage
   */
  loadSettings(): Promise<Settings>;

  /**
   * Save settings to storage
   */
  saveSettings(settings: Settings): Promise<void>;

  /**
   * Get default settings
   */
  getDefaultSettings(): Settings;

  /**
   * Reset settings to defaults
   */
  resetToDefaults(): Promise<void>;

  /**
   * Check if settings exist in storage
   */
  hasStoredSettings(): Promise<boolean>;

  /**
   * Get settings storage size
   */
  getStorageSize(): Promise<number>;

  /**
   * Export settings for backup
   */
  exportSettings(): Promise<{
    settings: SettingsStorageData;
    exportedAt: string;
    version: string;
  }>;

  /**
   * Import settings from backup
   */
  importSettings(data: {
    settings: SettingsStorageData;
    exportedAt: string;
    version: string;
  }): Promise<void>;
}
