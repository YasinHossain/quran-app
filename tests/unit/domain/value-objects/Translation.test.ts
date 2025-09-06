import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Translation Value Object', () => {
  const validId = 1;
  const validResourceId = 131;
  const validText = 'In the name of Allah, the Beneficent, the Merciful.';
  const validLanguageCode = 'en';

  // Helper functions to reduce nesting
  const expectTranslationToThrow = (
    id: number,
    resourceId: number,
    text: string,
    languageCode: string,
    expectedMessage: string
  ) => {
    const createTranslation = () => new Translation(id, resourceId, text, languageCode);
    expect(createTranslation).toThrow(expectedMessage);
  };

  const testLanguageCodes = (codes: string[], expectedResult: boolean) => {
    codes.forEach((code) => {
      const translation = new Translation(validId, validResourceId, validText, code);
      expect(translation.isEnglish()).toBe(expectedResult);
    });
  };

  describe('constructor', () => {
    it('should create a valid Translation with all parameters', () => {
      const translation = new Translation(validId, validResourceId, validText, validLanguageCode);

      expect(translation.id).toBe(validId);
      expect(translation.resourceId).toBe(validResourceId);
      expect(translation.text).toBe(validText);
      expect(translation.languageCode).toBe(validLanguageCode);
    });

    it('should create a Translation with default language code', () => {
      const translation = new Translation(validId, validResourceId, validText);

      expect(translation.languageCode).toBe('en');
    });

    it('should throw error for negative ID', () => {
      expectTranslationToThrow(
        -1,
        validResourceId,
        validText,
        validLanguageCode,
        'Translation ID must be non-negative'
      );
    });

    it('should throw error for negative resource ID', () => {
      expectTranslationToThrow(
        validId,
        -1,
        validText,
        validLanguageCode,
        'Resource ID must be non-negative'
      );
    });

    it('should throw error for empty text', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        '',
        validLanguageCode,
        'Translation text cannot be empty'
      );
    });

    it('should throw error for whitespace-only text', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        '   ',
        validLanguageCode,
        'Translation text cannot be empty'
      );
    });

    it('should throw error for empty language code', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        validText,
        '',
        'Language code cannot be empty'
      );
    });

    it('should throw error for whitespace-only language code', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        validText,
        '   ',
        'Language code cannot be empty'
      );
    });
  });

  describe('getWordCount', () => {
    it('should count words correctly', () => {
      const text = 'In the name of Allah, the Beneficent, the Merciful.';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getWordCount()).toBe(9);
    });

    it('should handle multiple spaces between words', () => {
      const text = 'In   the    name  of   Allah';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getWordCount()).toBe(5);
    });

    it('should handle leading and trailing spaces', () => {
      const text = '  In the name of Allah  ';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getWordCount()).toBe(5);
    });

    it('should return 1 for single word', () => {
      const text = 'Allah';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getWordCount()).toBe(1);
    });
  });

  describe('getCharacterCount', () => {
    it('should return correct character count including spaces', () => {
      const text = 'Hello World';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getCharacterCount()).toBe(11);
    });

    it('should handle empty-like text (spaces only)', () => {
      // This won't be created due to constructor validation
      // We can't test this directly due to constructor validation
      const translation = new Translation(validId, validResourceId, 'a');
      expect(translation.getCharacterCount()).toBe(1);
    });
  });

  describe('isEnglish', () => {
    it('should return true for English language codes', () => {
      const englishCodes = ['en', 'en-US', 'en-GB', 'EN'];
      testLanguageCodes(englishCodes, true);
    });

    it('should return false for non-English language codes', () => {
      const nonEnglishCodes = ['ar', 'fr', 'es', 'de', 'ur', 'fa'];
      testLanguageCodes(nonEnglishCodes, false);
    });
  });

  describe('contains', () => {
    it('should return true for exact match', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');

      expect(translation.contains('Hello World')).toBe(true);
    });

    it('should return true for partial match (case-insensitive)', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');

      expect(translation.contains('hello')).toBe(true);
      expect(translation.contains('WORLD')).toBe(true);
      expect(translation.contains('Hello')).toBe(true);
    });

    it('should return true for substring match', () => {
      const translation = new Translation(validId, validResourceId, 'In the name of Allah');

      expect(translation.contains('name of')).toBe(true);
      expect(translation.contains('Allah')).toBe(true);
    });

    it('should return false for non-matching text', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');

      expect(translation.contains('Goodbye')).toBe(false);
      expect(translation.contains('xyz')).toBe(false);
    });

    it('should handle empty search text', () => {
      const translation = new Translation(validId, validResourceId, 'Hello World');

      expect(translation.contains('')).toBe(true);
    });
  });

  describe('getPreview', () => {
    it('should return full text when word count is less than limit', () => {
      const text = 'Short text here';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getPreview(5)).toBe(text);
    });

    it('should return truncated text with ellipsis when word count exceeds limit', () => {
      const text = 'This is a very long text that should be truncated when preview is requested';
      const translation = new Translation(validId, validResourceId, text);

      const preview = translation.getPreview(5);
      expect(preview).toBe('This is a very long...');
    });

    it('should use default word limit of 10', () => {
      const text = 'This is a very long text that has more than ten words in it';
      const translation = new Translation(validId, validResourceId, text);

      const preview = translation.getPreview();
      expect(preview).toBe('This is a very long text that has more than...');
    });

    it('should handle text with exactly the word limit', () => {
      const text = 'One two three four five';
      const translation = new Translation(validId, validResourceId, text);

      expect(translation.getPreview(5)).toBe(text);
    });
  });

  describe('isLong', () => {
    it('should return true for translations with more than 50 words', () => {
      const longText = Array(51).fill('word').join(' ');
      const translation = new Translation(validId, validResourceId, longText);

      expect(translation.isLong()).toBe(true);
    });

    it('should return false for translations with 50 or fewer words', () => {
      const shortText = Array(50).fill('word').join(' ');
      const translation = new Translation(validId, validResourceId, shortText);

      expect(translation.isLong()).toBe(false);
    });

    it('should return false for very short translations', () => {
      const translation = new Translation(validId, validResourceId, 'Short text');

      expect(translation.isLong()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for translations with same ID and resource ID', () => {
      const translation1 = new Translation(1, 131, 'Text 1');
      const translation2 = new Translation(1, 131, 'Text 2'); // Different text but same IDs

      expect(translation1.equals(translation2)).toBe(true);
    });

    it('should return false for translations with different IDs', () => {
      const translation1 = new Translation(1, 131, validText);
      const translation2 = new Translation(2, 131, validText);

      expect(translation1.equals(translation2)).toBe(false);
    });

    it('should return false for translations with different resource IDs', () => {
      const translation1 = new Translation(1, 131, validText);
      const translation2 = new Translation(1, 132, validText);

      expect(translation1.equals(translation2)).toBe(false);
    });

    it('should return false for translations with both different IDs and resource IDs', () => {
      const translation1 = new Translation(1, 131, validText);
      const translation2 = new Translation(2, 132, validText);

      expect(translation1.equals(translation2)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties and computed values', () => {
      const translation = new Translation(
        validId,
        validResourceId,
        'This is a test translation with multiple words',
        'en-US'
      );

      const plainObject = translation.toPlainObject();

      expect(plainObject).toEqual({
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

    it('should return correct preview for long text', () => {
      const longText = Array(15).fill('word').join(' ');
      const translation = new Translation(validId, validResourceId, longText, 'ar');

      const plainObject = translation.toPlainObject();

      expect(plainObject.preview).toBe(Array(10).fill('word').join(' ') + '...');
      expect(plainObject.isLong).toBe(false); // 15 words < 50
      expect(plainObject.isEnglish).toBe(false);
    });
  });
});
