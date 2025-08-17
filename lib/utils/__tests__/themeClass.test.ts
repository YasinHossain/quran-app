import { themeClass } from '../themeClass';

describe('themeClass', () => {
  it('returns light classes for light theme', () => {
    expect(themeClass('light', 'light-class', 'dark-class')).toBe('light-class');
  });

  it('returns dark classes for dark theme', () => {
    expect(themeClass('dark', 'light-class', 'dark-class')).toBe('dark-class');
  });
});
