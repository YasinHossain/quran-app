import { validId, validResourceId } from './Translation/test-utils';
import { Translation } from '@/src/domain/value-objects/Translation';

describe('Translation word and character count', () => {
  it('counts words across variations', () => {
    const cases: Array<[string, number]> = [
      ['In the name of Allah, the Beneficent, the Merciful.', 9],
      ['In   the    name  of   Allah', 5],
      ['  In the name of Allah  ', 5],
      ['Allah', 1],
    ];
    cases.forEach(([text, expected]) => {
      const t = new Translation({ id: validId, resourceId: validResourceId, text });
      expect(t.getWordCount()).toBe(expected);
    });
  });

  it('returns correct character count including spaces', () => {
    const t1 = new Translation({ id: validId, resourceId: validResourceId, text: 'Hello World' });
    expect(t1.getCharacterCount()).toBe(11);
    const t2 = new Translation({ id: validId, resourceId: validResourceId, text: 'a' });
    expect(t2.getCharacterCount()).toBe(1);
  });
});
