import { buildTafsirExcerpt, buildVerseMetadataText } from '@/lib/seo/verseMetadata';

const AYAT_AL_KURSI =
  'Allāh - there is no deity except Him, the Ever-Living,<sup foot_note=196031>1</sup> the Self-Sustaining.<sup foot_note=196030>2</sup> Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission?';

describe('buildVerseMetadataText', () => {
  it('leads the title and description with the translation, without footnotes', () => {
    const { title, description } = buildVerseMetadataText({
      surahName: 'Surah Al-Baqarah',
      verseKey: '2:255',
      leadText: AYAT_AL_KURSI,
    });

    expect(title).toBe('Surah Al-Baqarah 2:255 – Allāh - there is no deity except Him…');
    expect(
      description.startsWith('Allāh - there is no deity except Him, the Ever-Living, the')
    ).toBe(true);
    expect(description).not.toMatch(/<|196031/);
    expect(description.endsWith(' Surah Al-Baqarah 2:255.')).toBe(true);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it('adds the full tail when a short translation leaves room', () => {
    const { title, description } = buildVerseMetadataText({
      surahName: 'Surah Al-Ikhlas',
      verseKey: '112:1',
      leadText: 'Say, "He is Allāh, [who is] One,',
    });

    expect(title).toBe('Surah Al-Ikhlas 112:1 – Say, "He is Allāh, [who is] One,');
    expect(description).toBe(
      'Say, "He is Allāh, [who is] One, Surah Al-Ikhlas 112:1 with Arabic text and tafsir.'
    );
  });

  it('localizes the verse key for bn and adds the Western key once', () => {
    const { title, description } = buildVerseMetadataText({
      surahName: 'সূরা আল-বাকারা',
      verseKey: '2:255',
      leadText:
        'আল্লাহ, তিনি ছাড়া কোনো ইলাহ নেই, তিনি চিরঞ্জীব, সুপ্রতিষ্ঠিত ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না।',
      templates: {
        title: '{{surah}} {{verseKey}} – {{snippet}}',
        titleFallback: '{{surah}} {{verseKey}}',
        descriptionFallback: '{{surah}} {{verseKey}} পড়ুন।',
        tail: 'আরবি পাঠ ও তাফসিরসহ {{surah}} {{verseKey}}।',
        tailShort: '{{surah}} {{verseKey}}।',
      },
      locale: 'bn',
    });

    expect(title.startsWith('সূরা আল-বাকারা ২:২৫৫ (2:255) – আল্লাহ')).toBe(true);
    expect(title.match(/2:255/g)).toHaveLength(1);
    expect(description).toContain('সূরা আল-বাকারা ২:২৫৫ (2:255)');
    expect(description.match(/2:255/g)).toHaveLength(1);
  });

  it('uses Arabic-Indic digits for ar with the Western key', () => {
    const { title, description } = buildVerseMetadataText({
      surahName: 'سورة البقرة',
      verseKey: '2:255',
      leadText: '',
      templates: {
        title: '{{surah}} {{verseKey}} – {{snippet}}',
        titleFallback: '{{surah}} {{verseKey}}',
        descriptionFallback: 'اقرأ {{surah}} {{verseKey}} مع التفسير على {{siteName}}.',
        tail: '{{surah}} {{verseKey}} مع التفسير.',
        tailShort: '{{surah}} {{verseKey}}.',
      },
      locale: 'ar',
    });

    expect(title).toBe('سورة البقرة ٢:٢٥٥ (2:255)');
    expect(description).toBe('اقرأ سورة البقرة ٢:٢٥٥ (2:255) مع التفسير على Al Quran.');
  });

  it('keeps English titles on Western digits only', () => {
    expect(
      buildVerseMetadataText({
        surahName: 'Surah Al-Ikhlas',
        verseKey: '112:1',
        leadText: 'Say, "He is Allāh, [who is] One,',
        locale: 'en',
      }).title
    ).toBe('Surah Al-Ikhlas 112:1 – Say, "He is Allāh, [who is] One,');
  });

  it('falls back to generic wording when there is no text', () => {
    expect(
      buildVerseMetadataText({ surahName: 'Surah Ya-Sin', verseKey: '36:45', leadText: '' })
    ).toEqual({
      title: 'Surah Ya-Sin 36:45',
      description: 'Read Surah Ya-Sin 36:45 with Arabic text, translation and tafsir on Al Quran.',
    });
  });
});

describe('buildTafsirExcerpt', () => {
  it('returns plain text cut on a word boundary', () => {
    const html = `<h2>The Virtue of Ayat Al-Kursi</h2><p>This is Ayat Al-Kursi &amp; its ${'virtue '.repeat(
      100
    )}</p>`;
    const excerpt = buildTafsirExcerpt(html);

    expect(excerpt.startsWith('The Virtue of Ayat Al-Kursi This is Ayat Al-Kursi & its')).toBe(
      true
    );
    expect(excerpt).not.toMatch(/[<>]/);
    expect(excerpt.length).toBeLessThanOrEqual(450);
    expect(excerpt.endsWith('virtue…')).toBe(true);
  });

  it('is empty without tafsir', () => {
    expect(buildTafsirExcerpt(undefined)).toBe('');
    expect(buildTafsirExcerpt('<p> </p>')).toBe('');
  });
});
