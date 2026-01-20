import { ARABIC_FONTS } from '@/app/providers/settingsStorage';

describe('ARABIC_FONTS', () => {
  it('contains expected font names', () => {
    const fontNames = ARABIC_FONTS.map((f) => f.name);
    const expectedNames = [
      'KFGQ',
      'KFGQ V2',
      'Me Quran',
      'Amiri Quran',

      'Scheherazade New',
      'Noto Naskh Arabic',

      'IndoPak Nastaleeq (Waqf Lazim)',
      'Noor-e-Huda',
      'Noor-e-Hidayat',
      'Noor-e-Hira',
      'Lateef',
    ];
    expectedNames.forEach((name) => {
      expect(fontNames).toContain(name);
    });
  });

  it('has correct categories for each font', () => {
    const expectedCategories: Record<string, string> = {
      KFGQ: 'Uthmani',
      'KFGQ V2': 'Uthmani',
      'Me Quran': 'Uthmani',
      'Amiri Quran': 'Uthmani',

      'Scheherazade New': 'Uthmani',
      'Noto Naskh Arabic': 'Uthmani',

      'IndoPak Nastaleeq (Waqf Lazim)': 'IndoPak',
      'Noor-e-Huda': 'IndoPak',
      'Noor-e-Hidayat': 'IndoPak',
      'Noor-e-Hira': 'IndoPak',
      Lateef: 'IndoPak',
    };

    ARABIC_FONTS.forEach((font) => {
      expect(font.category).toBe(expectedCategories[font.name]);
    });
  });
});
