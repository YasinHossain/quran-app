/**
 * Theme Service
 *
 * Application service for managing theme state and DOM updates.
 */

import { IThemeRepository } from '../../domain/repositories/IThemeRepository';
import { Theme, ThemeMode, ResolvedTheme } from '../../domain/entities/Theme';

export interface ThemeServiceConfig {
  autoSave?: boolean;
  validateOnUpdate?: boolean;
  updateDOM?: boolean;
}

export class ThemeService {
  private theme: Theme | null = null;
  private mediaQuery: MediaQueryList | null = null;

  constructor(
    private readonly themeRepository: IThemeRepository,
    private readonly config: ThemeServiceConfig = {}
  ) {
    this.config = {
      autoSave: true,
      validateOnUpdate: true,
      updateDOM: true,
      ...config,
    };

    // Listen for system theme changes if running in browser
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
  }

  async getTheme(): Promise<Theme> {
    if (!this.theme) {
      this.theme = await this.themeRepository.getTheme();
      if (this.config.updateDOM) {
        this.updateDOMTheme(this.theme);
      }
    }
    return this.theme;
  }

  async setTheme(mode: ThemeMode): Promise<void> {
    const currentTheme = await this.getTheme();
    const newTheme = currentTheme.withMode(mode);

    if (this.config.validateOnUpdate && !newTheme.isValid()) {
      throw new Error('Invalid theme mode');
    }

    // Update resolved theme based on new mode
    const resolvedTheme = newTheme.resolveTheme();
    const finalTheme = newTheme.withResolvedTheme(resolvedTheme);

    this.theme = finalTheme;

    if (this.config.updateDOM) {
      this.updateDOMTheme(finalTheme);
    }

    if (this.config.autoSave) {
      await this.themeRepository.saveTheme(finalTheme);
    }
  }

  async toggleTheme(): Promise<ResolvedTheme> {
    const currentTheme = await this.getTheme();
    const currentResolved = currentTheme.resolveTheme();
    const newMode: ThemeMode = currentResolved === 'light' ? 'dark' : 'light';

    await this.setTheme(newMode);

    const updatedTheme = await this.getTheme();
    return updatedTheme.resolveTheme();
  }

  async getResolvedTheme(): Promise<ResolvedTheme> {
    const theme = await this.getTheme();
    return theme.resolveTheme();
  }

  async getCurrentMode(): Promise<ThemeMode> {
    const theme = await this.getTheme();
    return theme.mode;
  }

  async isSystemMode(): Promise<boolean> {
    const theme = await this.getTheme();
    return theme.isSystemMode();
  }

  async isDarkMode(): Promise<boolean> {
    const theme = await this.getTheme();
    return theme.shouldUseDarkMode();
  }

  async resetToDefaults(): Promise<void> {
    const defaultTheme = Theme.create();
    this.theme = defaultTheme;

    if (this.config.updateDOM) {
      this.updateDOMTheme(defaultTheme);
    }

    if (this.config.autoSave) {
      await this.themeRepository.saveTheme(defaultTheme);
    }
  }

  async clearTheme(): Promise<void> {
    this.theme = null;
    await this.themeRepository.clearTheme();

    if (this.config.updateDOM && typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
  }

  private updateDOMTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    const isDark = theme.shouldUseDarkMode();
    document.documentElement.classList.toggle('dark', isDark);
  }

  private handleSystemThemeChange = async (): Promise<void> => {
    const currentTheme = await this.getTheme();
    if (currentTheme.isSystemMode()) {
      // Update resolved theme when system preference changes
      const newResolvedTheme = currentTheme.resolveTheme();
      const updatedTheme = currentTheme.withResolvedTheme(newResolvedTheme);

      this.theme = updatedTheme;

      if (this.config.updateDOM) {
        this.updateDOMTheme(updatedTheme);
      }

      if (this.config.autoSave) {
        await this.themeRepository.saveTheme(updatedTheme);
      }
    }
  };

  // Cleanup method for removing event listeners
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
  }
}
