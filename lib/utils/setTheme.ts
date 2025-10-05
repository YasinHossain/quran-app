export type TokenTheme = 'base' | 'alt';
import { setItem } from '@/lib/utils/safeLocalStorage';

/**
 * Toggle design token theme without touching component code.
 * Applies the `theme-alt` class to the document root when `alt` is chosen.
 */
export const setTheme = (theme: TokenTheme): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'alt') {
    root.classList.add('theme-alt');
    setItem('token-theme', 'alt');
  } else {
    root.classList.remove('theme-alt');
    setItem('token-theme', 'base');
  }
};
