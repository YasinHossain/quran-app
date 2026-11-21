import { buildTafsirIntro, isMostlyArabic, toTafsirBlocks } from '@/lib/seo/tafsirIntro';

describe('toTafsirBlocks', () => {
  it('keeps headings and paragraphs in order as plain text', () => {
    expect(
      toTafsirBlocks(
        '<h2>Which was revealed in Makkah</h2><h2>The Virtues</h2><p>Imam Ahmad recorded &amp; said,</p><p>«تَبَارَكَ»</p>'
      )
    ).toEqual([
      { kind: 'heading', text: 'Which was revealed in Makkah' },
      { kind: 'heading', text: 'The Virtues' },
      { kind: 'paragraph', text: 'Imam Ahmad recorded & said,' },
      { kind: 'paragraph', text: '«تَبَارَكَ»' },
    ]);
  });

  it('keeps text that sits outside any block and drops inline markup', () => {
    expect(
      toTafsirBlocks(
        'تفسیر سورۃ الملک:<div lang="ur"><p>رسول اللہ <span class="saw">ﷺ</span> نے</p></div>'
      )
    ).toEqual([
      { kind: 'paragraph', text: 'تفسیر سورۃ الملک:' },
      { kind: 'paragraph', text: 'رسول اللہ ﷺ نے' },
    ]);
  });
});

describe('buildTafsirIntro', () => {
  it('cuts one long paragraph at a sentence end within the budget', () => {
    const sentence = 'এটি একটি বাক্য। ';
    const intro = buildTafsirIntro(`<p>${sentence.repeat(200)}</p>`, 100)!;

    expect(intro.truncated).toBe(true);
    expect(intro.blocks).toHaveLength(1);
    expect(intro.blocks[0]!.text.length).toBeLessThanOrEqual(100);
    expect(intro.blocks[0]!.text.endsWith('।')).toBe(true);
  });

  it('shows short commentary whole, without marking it truncated', () => {
    expect(buildTafsirIntro('<h2>Intro</h2><p>A short note.</p>')).toEqual({
      blocks: [
        { kind: 'heading', text: 'Intro' },
        { kind: 'paragraph', text: 'A short note.' },
      ],
      truncated: false,
    });
  });

  it('does not end on a lead-in or a heading whose text was left out', () => {
    const html = `<p>${'First part. '.repeat(8)}</p><p>Then he said:</p><h2>Next section</h2><p>${'More text. '.repeat(30)}</p>`;
    const intro = buildTafsirIntro(html, 140)!;

    expect(intro.truncated).toBe(true);
    expect(intro.blocks.at(-1)).toEqual({
      kind: 'paragraph',
      text: expect.stringMatching(/part\.$/),
    });
  });

  it('does not end on an Arabic quotation whose translation was cut, nor on its lead-in', () => {
    const html = `<p>${'He went to the cave. '.repeat(5)}The angel said, "Read!" The Messenger of Allah said,</p><p>«فَقُلْتُ: مَا أَنَا بِقَارِىء»</p><p>${'(I said: I am not a reader.) '.repeat(20)}</p>`;
    const intro = buildTafsirIntro(html, 200)!;

    expect(intro.truncated).toBe(true);
    expect(intro.blocks).toHaveLength(1);
    expect(intro.blocks[0]!.text).toMatch(/said, "Read!"$/);
  });

  it('keeps Arabic text when the tafsir itself is Arabic', () => {
    const html = `<p>${'قال ابن كثير في تفسيره. '.repeat(3)}</p><p>${'وهذا نص طويل. '.repeat(40)}</p>`;
    const intro = buildTafsirIntro(html, 200)!;

    expect(intro.truncated).toBe(true);
    expect(intro.blocks).toHaveLength(2);
  });

  it('returns null when there is no text', () => {
    expect(buildTafsirIntro(undefined)).toBeNull();
    expect(buildTafsirIntro('<h2>Only a heading</h2>')).toBeNull();
  });
});

describe('isMostlyArabic', () => {
  it('tells quoted Arabic apart from translation text', () => {
    expect(isMostlyArabic('«إِنَّ سُورَةً فِي الْقُرْآنِ»')).toBe(true);
    expect(isMostlyArabic('(Verily, there is a chapter in the Qur’an)')).toBe(false);
  });
});
