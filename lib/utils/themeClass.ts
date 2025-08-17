import type { Theme } from '@/app/providers/ThemeContext';

export const themeClass = (theme: Theme, light: string, dark: string): string =>
  theme === 'light' ? light : dark;

export default themeClass;
