/**
 * Theme Repository Interface
 *
 * Contract for theme persistence operations.
 */

import { Theme } from '../entities/Theme';

export interface IThemeRepository {
  getTheme(): Promise<Theme>;
  saveTheme(theme: Theme): Promise<void>;
  clearTheme(): Promise<void>;
}
