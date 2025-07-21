import { ARABIC_FONTS } from '@/app/context/SettingsContext';

describe('ARABIC_FONTS', () => {
  it('contains expected font names', () => {
    const fontNames = ARABIC_FONTS.map(f => f.name);
    const expectedNames = [
      'KFGQPC Uthman Taha',
      'Al Mushaf',
      'Amiri',
      'Scheherazade New',
      'Noto Naskh Arabic',
      'Me Quran',
      'PDMS Saleem Quran',
      'Noto Nastaliq Urdu',
      'Noor-e-Hira',
      'Lateef',
    ];
    expectedNames.forEach(name => {
      expect(fontNames).toContain(name);
    });
  });

  it('has correct categories for each font', () => {
    const expectedCategories: Record<string, string> = {
      'KFGQPC Uthman Taha': 'Uthmani',
      'Al Mushaf': 'Uthmani',
      'Amiri': 'Uthmani',
      'Scheherazade New': 'Uthmani',
      'Noto Naskh Arabic': 'Uthmani',
      'Me Quran': 'Uthmani',
      'PDMS Saleem Quran': 'Uthmani',
      'Noto Nastaliq Urdu': 'IndoPak',
      'Noor-e-Hira': 'IndoPak',
      'Lateef': 'IndoPak',
    };

    ARABIC_FONTS.forEach(font => {
      expect(font.category).toBe(expectedCategories[font.name]);
    });
  });
});
