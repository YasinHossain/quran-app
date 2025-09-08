import {
  validId,
  validResourceId,
  validText,
  validLanguageCode,
  expectTranslationToThrow,
} from './Translation/test-utils';
import { Translation } from '@/src/domain/value-objects/Translation';

describe('Translation Parsing and Validation', () => {
  describe('constructor', () => {
    it('creates a valid Translation with all parameters', () => {
      const translation = new Translation({
        id: validId,
        resourceId: validResourceId,
        text: validText,
        languageCode: validLanguageCode,
      });
      expect(translation.id).toBe(validId);
      expect(translation.resourceId).toBe(validResourceId);
      expect(translation.text).toBe(validText);
      expect(translation.languageCode).toBe(validLanguageCode);
    });

    it('creates a Translation with default language code', () => {
      const translation = new Translation({ id: validId, resourceId: validResourceId, text: validText });
      expect(translation.languageCode).toBe('en');
    });

    it('throws error for negative ID', () => {
      expectTranslationToThrow({
        id: -1,
        resourceId: validResourceId,
        text: validText,
        languageCode: validLanguageCode,
        expectedMessage: 'Translation ID must be non-negative',
      });
    });

    it('throws error for negative resource ID', () => {
      expectTranslationToThrow({
        id: validId,
        resourceId: -1,
        text: validText,
        languageCode: validLanguageCode,
        expectedMessage: 'Resource ID must be non-negative',
      });
    });

    it('throws error for empty text', () => {
      expectTranslationToThrow({
        id: validId,
        resourceId: validResourceId,
        text: '',
        languageCode: validLanguageCode,
        expectedMessage: 'Translation text cannot be empty',
      });
    });

    it('throws error for whitespace-only text', () => {
      expectTranslationToThrow({
        id: validId,
        resourceId: validResourceId,
        text: '   ',
        languageCode: validLanguageCode,
        expectedMessage: 'Translation text cannot be empty',
      });
    });

    it('throws error for empty language code', () => {
      expectTranslationToThrow({
        id: validId,
        resourceId: validResourceId,
        text: validText,
        languageCode: '',
        expectedMessage: 'Language code cannot be empty',
      });
    });

    it('throws error for whitespace-only language code', () => {
      expectTranslationToThrow({
        id: validId,
        resourceId: validResourceId,
        text: validText,
        languageCode: '   ',
        expectedMessage: 'Language code cannot be empty',
      });
    });
  });
});
