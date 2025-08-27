/**
 * Theme Domain Entity
 *
 * Represents application theme preferences and settings.
 * Immutable entity with business logic for theme management.
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeStorageData {
  mode: ThemeMode;
  lastResolvedTheme?: ResolvedTheme;
  version?: number;
}

export class Theme {
  constructor(
    public readonly mode: ThemeMode,
    public readonly lastResolvedTheme?: ResolvedTheme
  ) {}

  static create(data: Partial<ThemeStorageData> = {}): Theme {
    return new Theme(data.mode ?? 'system', data.lastResolvedTheme);
  }

  static fromStorage(data: ThemeStorageData): Theme {
    return new Theme(data.mode, data.lastResolvedTheme);
  }

  withMode(mode: ThemeMode): Theme {
    return new Theme(mode, this.lastResolvedTheme);
  }

  withResolvedTheme(resolvedTheme: ResolvedTheme): Theme {
    return new Theme(this.mode, resolvedTheme);
  }

  resolveTheme(): ResolvedTheme {
    if (this.mode === 'light' || this.mode === 'dark') {
      return this.mode;
    }

    // For 'system', try to detect system preference
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    // Fallback to last resolved theme or light
    return this.lastResolvedTheme ?? 'light';
  }

  shouldUseDarkMode(): boolean {
    return this.resolveTheme() === 'dark';
  }

  isSystemMode(): boolean {
    return this.mode === 'system';
  }

  isValid(): boolean {
    return ['light', 'dark', 'system'].includes(this.mode);
  }

  toStorageData(): ThemeStorageData {
    return {
      mode: this.mode,
      lastResolvedTheme: this.lastResolvedTheme,
      version: 1,
    };
  }
}
