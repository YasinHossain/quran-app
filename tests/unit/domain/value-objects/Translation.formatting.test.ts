import { Translation } from '../../../../src/domain/value-objects/Translation';
import { validId, validResourceId, validText, testLanguageCodes } from './Translation/test-utils';

describe('Translation Formatting and Comparison', () => {
  describe('getWordCount', () => {
    test.each([
      ['In the name of Allah, the Beneficent, the Merciful.', 9],
      ['In   the    name  of   Allah', 5],
      ['  In the name of Allah  ', 5],
      ['Allah', 1],
    ])('counts words in %s', (text, expected) => {
      const translation = new Translation(validId, validResourceId, text);
      expect(translation.getWordCount()).toBe(expected);
    });
  });

  describe('getCharacterCount', () => {
    it('returns correct character count including spaces', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');
      expect(translation.getCharacterCount()).toBe(11);
    });
    it('handles minimum text', () => {
      const translation = new Translation(validId, validResourceId, 'a');
      expect(translation.getCharacterCount()).toBe(1);
    });
  });

  describe('isEnglish', () => {
    it('detects English language codes', () => {
      testLanguageCodes(['en', 'en-US', 'en-GB', 'EN'], true);
    });
    it('detects non-English language codes', () => {
      testLanguageCodes(['ar', 'fr', 'es', 'de', 'ur', 'fa'], false);
    });
  });

  describe('contains', () => {
    it('matches exact text', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');
      expect(translation.contains('Hello World')).toBe(true);
    });
    it('matches case-insensitive and partial text', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');
      ['hello', 'WORLD', 'Hello'].forEach((t) => expect(translation.contains(t)).toBe(true));
    });
    it('matches substrings', () => {
      const translation = new Translation(validId, validResourceId, 'In the name of Allah');
      ['name of', 'Allah'].forEach((t) => expect(translation.contains(t)).toBe(true));
    });
    it('returns false for non-matching text', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');
      ['Goodbye', 'xyz'].forEach((t) => expect(translation.contains(t)).toBe(false));
    });
    it('handles empty search text', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');
      expect(translation.contains('')).toBe(true);
    });
  });

  describe('getPreview', () => {
    const longText = 'This is a very long text that should be truncated when preview is requested';
    it('returns full text when word count is less than limit', () => {
      const translation = new Translation(validId, validResourceId, 'Short text here');
      expect(translation.getPreview(5)).toBe('Short text here');
    });
    it('truncates long text with ellipsis', () => {
      const translation = new Translation(validId, validResourceId, longText);
      expect(translation.getPreview(5)).toBe('This is a very long...');
    });
    it('uses default word limit of 10', () => {
      const text = 'This is a very long text that has more than ten words in it';
      const translation = new Translation(validId, validResourceId, text);
      expect(translation.getPreview()).toBe('This is a very long text that has more than...');
    });
    it('handles text with exactly the word limit', () => {
      const translation = new Translation(validId, validResourceId, 'One two three four five');
      expect(translation.getPreview(5)).toBe('One two three four five');
    });
  });

  describe('isLong', () => {
    it('returns true for translations with more than 50 words', () => {
      const longText = Array(51).fill('word').join(' ');
      const translation = new Translation(validId, validResourceId, longText);
      expect(translation.isLong()).toBe(true);
    });
    test.each([
      [Array(50).fill('word').join(' ')],
      ['Short text'],
    ])('returns false for %s', (text) => {
      const translation = new Translation(validId, validResourceId, text);
      expect(translation.isLong()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true for translations with same ID and resource ID', () => {
      const translation1 = new Translation(1, 131, 'Text 1');
      const translation2 = new Translation(1, 131, 'Text 2');
      expect(translation1.equals(translation2)).toBe(true);
    });
    test.each([
      [new Translation(1, 131, validText), new Translation(2, 131, validText)],
      [new Translation(1, 131, validText), new Translation(1, 132, validText)],
      [new Translation(1, 131, validText), new Translation(2, 132, validText)],
    ])('returns false for different translations', (t1, t2) => {
      expect(t1.equals(t2)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('returns plain object with all properties and computed values', () => {
      const translation = new Translation(
        validId,
        validResourceId,
        'This is a test translation with multiple words',
        'en-US'
      );
      expect(translation.toPlainObject()).toEqual({
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
    it('returns correct preview for long text', () => {
      const longText = Array(15).fill('word').join(' ');
      const translation = new Translation(validId, validResourceId, longText, 'ar');
      const plainObject = translation.toPlainObject();
      expect(plainObject.preview).toBe(Array(10).fill('word').join(' ') + '...');
      expect(plainObject.isLong).toBe(false);
      expect(plainObject.isEnglish).toBe(false);
    });
  });
});
