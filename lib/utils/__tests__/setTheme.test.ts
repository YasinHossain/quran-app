import { setTheme } from '../setTheme';

describe('setTheme', () => {
  afterEach(() => {
    document.documentElement.classList.remove('theme-alt');
    localStorage.clear();
  });

  it('adds theme-alt class when alt theme is set', () => {
    setTheme('alt');
    expect(document.documentElement.classList.contains('theme-alt')).toBe(true);
    expect(localStorage.getItem('token-theme')).toBe('alt');
  });

  it('removes theme-alt class when base theme is set', () => {
    document.documentElement.classList.add('theme-alt');
    setTheme('base');
    expect(document.documentElement.classList.contains('theme-alt')).toBe(false);
    expect(localStorage.getItem('token-theme')).toBe('base');
  });
});
