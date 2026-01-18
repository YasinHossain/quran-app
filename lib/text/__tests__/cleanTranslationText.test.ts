import { cleanTranslationText } from '@/lib/text/cleanTranslationText';

describe('cleanTranslationText', () => {
  it('removes a leading verse reference like [9:63]', () => {
    expect(cleanTranslationText('[9:63] Are they not aware?')).toBe('Are they not aware?');
  });

  it('removes "See ..." parenthetical references', () => {
    expect(cleanTranslationText('They are a people. (See V. 21:98-101)')).toBe('They are a people.');
  });

  it('keeps non-reference parentheses', () => {
    expect(cleanTranslationText('Is he (Jesus) better?')).toBe('Is he (Jesus) better?');
  });

  it('strips HTML before cleaning', () => {
    expect(cleanTranslationText('<p>[2:3] Foo <b>bar</b></p>')).toBe('Foo bar');
  });
});

