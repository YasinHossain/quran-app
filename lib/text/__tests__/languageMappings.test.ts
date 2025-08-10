import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';

describe('language mappings', () => {
  it('maps language names to codes and labels', () => {
    expect(LANGUAGE_CODES.english).toBe('en');
    expect(WORD_LANGUAGE_LABELS.bengali).toBe('Bangla');
  });

  it('has non-empty keys and values for all mappings', () => {
    Object.entries(LANGUAGE_CODES).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(key).not.toHaveLength(0);
      expect(typeof value).toBe('string');
      expect(value).not.toHaveLength(0);
    });
    Object.entries(WORD_LANGUAGE_LABELS).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(key).not.toHaveLength(0);
      expect(typeof value).toBe('string');
      expect(value).not.toHaveLength(0);
    });
  });
});
