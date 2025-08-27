import { ARABIC_FONTS } from '@/src/domain/constants/fonts';

describe('ARABIC_FONTS', () => {
  it('contains expected font names', () => {
    const fontNames = ARABIC_FONTS.map((f) => f.name);
    const expectedNames = [
      'KFGQPC Uthman Taha',
      'Amiri',
      'Scheherazade New',
      'Noto Naskh Arabic',
      'Noto Nastaliq Urdu',
      'Noor-e-Hira',
      'Lateef',
    ];
    expectedNames.forEach((name) => {
      expect(fontNames).toContain(name);
    });
  });

  it('has correct categories for each font', () => {
    const expectedCategories: Record<string, string> = {
      'KFGQPC Uthman Taha': 'Uthmani',
      Amiri: 'Uthmani',
      'Scheherazade New': 'Uthmani',
      'Noto Naskh Arabic': 'Uthmani',
      'Noto Nastaliq Urdu': 'IndoPak',
      'Noor-e-Hira': 'IndoPak',
      Lateef: 'IndoPak',
    };

    ARABIC_FONTS.forEach((font) => {
      expect(font.category).toBe(expectedCategories[font.name]);
    });
  });
});
