import { validId, validResourceId, testLanguageCodes } from './Translation/test-utils';
import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Translation language and contains', () => {
  it('detects English language codes', () => {
    testLanguageCodes(['en', 'en-US', 'en-GB', 'EN'], true);
  });

  it('detects non-English language codes', () => {
    testLanguageCodes(['ar', 'fr', 'es', 'de', 'ur', 'fa'], false);
  });

  it('contains matches exact, partial, and case-insensitive text', () => {
    const t = new Translation({
      id: validId,
      resourceId: validResourceId,
      text: 'In the name of Allah',
    });
    expect(t.contains('In the name of Allah')).toBe(true);
    ['in the', 'ALLAH', 'name of'].forEach((q) => expect(t.contains(q)).toBe(true));
    ['Goodbye', 'xyz'].forEach((q) => expect(t.contains(q)).toBe(false));
    expect(t.contains('')).toBe(true);
  });
});
