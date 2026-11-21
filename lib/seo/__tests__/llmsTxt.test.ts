import { buildLlmsTxt } from '@/lib/seo/llmsTxt';

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt(new Map([[1, 'Al-Fatihah']]));
  const surahLinks = text.split('\n').filter((line) => /^- \[\d+\. /.test(line));

  it('lists all 114 surahs with canonical slug URLs', () => {
    expect(surahLinks).toHaveLength(114);
    expect(surahLinks[0]).toMatch(/^- \[1\. Al-Fatihah\]\(https?:\/\/[^)]+\/surah\/al-fatihah\)$/);
    expect(surahLinks[113]).toMatch(/^- \[114\. An-Nas\]\(https?:\/\/[^)]+\/surah\/an-nas\)$/);
  });

  it('starts with the llms.txt H1 and summary and documents the URL patterns', () => {
    expect(text.startsWith('# Al Quran\n\n> ')).toBe(true);
    expect(text).toContain('/surah/{slug}/{verse}');
    expect(text).toContain('/tafsir/{slug}/{verse}');
  });
});
