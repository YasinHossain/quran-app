import { INLINE_THEME_SCRIPT } from '@/app/layout';

describe('RootLayout theme script', () => {
  it('applies dark class from stored theme', () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.className = '';
    document.documentElement.dataset.theme = '';
    // Execute inline script

    eval(INLINE_THEME_SCRIPT);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
