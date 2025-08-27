/**
 * Theme Repository Implementation
 *
 * localStorage-based implementation for theme persistence.
 */

import { IThemeRepository } from '../../domain/repositories/IThemeRepository';
import { Theme, ThemeStorageData } from '../../domain/entities/Theme';

export class ThemeRepository implements IThemeRepository {
  private readonly STORAGE_KEY = 'theme';
  private readonly STORAGE_VERSION = 1;

  async getTheme(): Promise<Theme> {
    try {
      if (typeof window === 'undefined') {
        return Theme.create();
      }

      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return Theme.create();
      }

      // Handle both new format and legacy string format
      let data: ThemeStorageData;
      if (stored === 'light' || stored === 'dark') {
        // Legacy format - migrate to new format
        data = { mode: stored as 'light' | 'dark', version: 1 };
      } else {
        data = JSON.parse(stored) as ThemeStorageData;
      }

      // Handle version migrations if needed
      if (!data.version || data.version < this.STORAGE_VERSION) {
        const migrated = await this.migrateData(data);
        await this.saveTheme(migrated);
        return migrated;
      }

      return Theme.fromStorage(data);
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
      return Theme.create();
    }
  }

  async saveTheme(theme: Theme): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      const data = theme.toStorageData();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

      // Also save as cookie for SSR
      const resolved = theme.resolveTheme();
      document.cookie = `theme=${resolved}; path=/; max-age=31536000`;
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
      throw new Error('Failed to save theme');
    }
  }

  async clearTheme(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.STORAGE_KEY);
      // Clear cookie as well
      document.cookie = 'theme=; path=/; max-age=0';
    } catch (error) {
      console.error('Failed to clear theme from storage:', error);
    }
  }

  private async migrateData(oldData: unknown): Promise<Theme> {
    // Handle legacy string format migration
    if (typeof oldData === 'string') {
      return Theme.create({ mode: oldData as 'light' | 'dark' });
    }

    // Handle other migrations if needed in the future
    return Theme.create(oldData);
  }
}
