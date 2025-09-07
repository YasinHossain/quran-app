import {
  validId,
  validResourceId,
  validText,
  validLanguageCode,
  expectTranslationToThrow,
} from './Translation/test-utils';
import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Translation Parsing and Validation', () => {
  describe('constructor', () => {
    it('creates a valid Translation with all parameters', () => {
      const translation = new Translation(validId, validResourceId, validText, validLanguageCode);
      expect(translation.id).toBe(validId);
      expect(translation.resourceId).toBe(validResourceId);
      expect(translation.text).toBe(validText);
      expect(translation.languageCode).toBe(validLanguageCode);
    });

    it('creates a Translation with default language code', () => {
      const translation = new Translation(validId, validResourceId, validText);
      expect(translation.languageCode).toBe('en');
    });

    it('throws error for negative ID', () => {
      expectTranslationToThrow(
        -1,
        validResourceId,
        validText,
        validLanguageCode,
        'Translation ID must be non-negative'
      );
    });

    it('throws error for negative resource ID', () => {
      expectTranslationToThrow(
        validId,
        -1,
        validText,
        validLanguageCode,
        'Resource ID must be non-negative'
      );
    });

    it('throws error for empty text', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        '',
        validLanguageCode,
        'Translation text cannot be empty'
      );
    });

    it('throws error for whitespace-only text', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        '   ',
        validLanguageCode,
        'Translation text cannot be empty'
      );
    });

    it('throws error for empty language code', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        validText,
        '',
        'Language code cannot be empty'
      );
    });

    it('throws error for whitespace-only language code', () => {
      expectTranslationToThrow(
        validId,
        validResourceId,
        validText,
        '   ',
        'Language code cannot be empty'
      );
    });
  });
});
