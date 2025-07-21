import { ARABIC_FONTS } from '@/app/context/SettingsContext';

describe('ARABIC_FONTS', () => {
  it('contains expected font names', () => {
    const fontNames = ARABIC_FONTS.map(f => f.name);
    const expectedNames = [
      'KFGQ',
      'KFGQ V2',
      'Me Quran',
      'Al Mushaf',
      'PDMS Saleem Quran',
      'PDMS Islamic',
      'Al Qalam Quran Majeed',
      'Amiri Quran',
    ];
    expectedNames.forEach(name => {
      expect(fontNames).toContain(name);
    });
  });

  it('has correct categories for each font', () => {
    const expectedCategories: Record<string, string> = {
      'KFGQ': 'Uthmani',
      'KFGQ V2': 'Uthmani',
      'Me Quran': 'Uthmani',
      'Al Mushaf': 'Uthmani',
      'PDMS Saleem Quran': 'Indopak',
      'PDMS Islamic': 'Indopak',
      'Al Qalam Quran Majeed': 'Indopak',
      'Amiri Quran': 'Uthmani',
    };

    ARABIC_FONTS.forEach(font => {
      expect(font.category).toBe(expectedCategories[font.name]);
    });
  });
});
