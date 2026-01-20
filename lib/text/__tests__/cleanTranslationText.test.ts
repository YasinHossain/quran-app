import { cleanTranslationText } from '@/lib/text/cleanTranslationText';

describe('cleanTranslationText', () => {
  it('removes a leading verse reference like [9:63]', () => {
    expect(cleanTranslationText('[9:63] Are they not aware?')).toBe('Are they not aware?');
  });

  it('removes "See ..." parenthetical references', () => {
    expect(cleanTranslationText('They are a people. (See V. 21:98-101)')).toBe(
      'They are a people.'
    );
  });

  it('keeps non-reference parentheses', () => {
    expect(cleanTranslationText('Is he (Jesus) better?')).toBe('Is he (Jesus) better?');
  });

  it('strips HTML before cleaning', () => {
    expect(cleanTranslationText('<p>[2:3] Foo <b>bar</b></p>')).toBe('Foo bar');
  });

  it('removes Quran.com footnote sup tags', () => {
    expect(
      cleanTranslationText(
        'Allāh - there is no deity except Him<sup foot_note=123>1</sup> and He knows.'
      )
    ).toBe('Allāh - there is no deity except Him and He knows.');
  });
});
