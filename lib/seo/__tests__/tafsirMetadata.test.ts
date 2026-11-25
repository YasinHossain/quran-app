import { buildTafsirMetadataText, cleanTranslationText } from '@/lib/seo/tafsirMetadata';

describe('buildTafsirMetadataText', () => {
  it('leads with the translation and strips footnote markers', () => {
    const { title, description } = buildTafsirMetadataText({
      chapterName: "Al-Ma'idah",
      verseKey: '5:9',
      translationText:
        'Allah has promised those who believe and do righteous deeds<sup foot_note=1>1</sup> that for them there is forgiveness and great reward.',
    });
    expect(title.startsWith("Al-Ma'idah 5:9 Tafsir – Allah has promised")).toBe(true);
    expect(title.endsWith('…')).toBe(true);
    expect(description.startsWith('Allah has promised those who believe')).toBe(true);
    expect(description).not.toMatch(/<|foot_note/);
    expect(description).toContain('Ibn Kathir');
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it('trims long translations on a word boundary', () => {
    const { description } = buildTafsirMetadataText({
      chapterName: 'Al-Baqarah',
      verseKey: '2:255',
      translationText: 'word '.repeat(80),
    });
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toMatch(/word…/);
  });

  it('falls back to the generic text without a translation', () => {
    expect(buildTafsirMetadataText({ chapterName: 'Al-Fatihah', verseKey: '1:1' })).toEqual({
      title: 'Tafsir of Al-Fatihah 1:1',
      description: 'Read tafsir for Al-Fatihah 1:1 on Al Quran.',
    });
  });
});

describe('cleanTranslationText', () => {
  it('removes tags and collapses whitespace', () => {
    expect(cleanTranslationText('A <b>b</b>  c <sup>2</sup>.')).toBe('A b c.');
  });
});
