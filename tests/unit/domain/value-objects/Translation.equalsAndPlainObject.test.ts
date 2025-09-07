import { validId, validResourceId, validText } from './Translation/test-utils';
import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Translation equals and toPlainObject', () => {
  it('equals returns true for same id/resourceId and false otherwise', () => {
    const t1 = new Translation(1, 131, 'Text 1');
    const t2 = new Translation(1, 131, 'Text 2');
    expect(t1.equals(t2)).toBe(true);

    const cases: Array<[Translation, Translation]> = [
      [new Translation(1, 131, validText), new Translation(2, 131, validText)],
      [new Translation(1, 131, validText), new Translation(1, 132, validText)],
      [new Translation(1, 131, validText), new Translation(2, 132, validText)],
    ];
    cases.forEach(([a, b]) => expect(a.equals(b)).toBe(false));
  });

  it('toPlainObject returns full snapshot with computed values', () => {
    const t = new Translation(
      validId,
      validResourceId,
      'This is a test translation with multiple words',
      'en-US'
    );
    expect(t.toPlainObject()).toEqual({
      id: validId,
      resourceId: validResourceId,
      text: 'This is a test translation with multiple words',
      languageCode: 'en-US',
      wordCount: 8,
      characterCount: 46,
      isEnglish: true,
      isLong: false,
      preview: 'This is a test translation with multiple words',
    });
  });
});
