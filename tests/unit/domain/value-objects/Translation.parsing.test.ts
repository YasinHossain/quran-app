import { Translation } from '@/src/domain/value-objects/Translation';
import {
  validId,
  validResourceId,
  validText,
  validLanguageCode,
  expectTranslationToThrow,
} from '@/tests/unit/domain/value-objects/Translation/test-utils';

const invalidTranslations = [
  {
    name: 'negative ID',
    params: {
      id: -1,
      resourceId: validResourceId,
      text: validText,
      languageCode: validLanguageCode,
    },
    message: 'Translation ID must be non-negative',
  },
  {
    name: 'negative resource ID',
    params: { id: validId, resourceId: -1, text: validText, languageCode: validLanguageCode },
    message: 'Resource ID must be non-negative',
  },
  {
    name: 'empty text',
    params: { id: validId, resourceId: validResourceId, text: '', languageCode: validLanguageCode },
    message: 'Translation text cannot be empty',
  },
  {
    name: 'whitespace-only text',
    params: {
      id: validId,
      resourceId: validResourceId,
      text: '   ',
      languageCode: validLanguageCode,
    },
    message: 'Translation text cannot be empty',
  },
  {
    name: 'empty language code',
    params: { id: validId, resourceId: validResourceId, text: validText, languageCode: '' },
    message: 'Language code cannot be empty',
  },
  {
    name: 'whitespace-only language code',
    params: { id: validId, resourceId: validResourceId, text: validText, languageCode: '   ' },
    message: 'Language code cannot be empty',
  },
];

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
      const translation = new Translation({
        id: validId,
        resourceId: validResourceId,
        text: validText,
      });
      expect(translation.languageCode).toBe('en');
    });
    for (const { name, params, message } of invalidTranslations) {
      it(`throws error for ${name}`, () => {
        expectTranslationToThrow({ ...params, expectedMessage: message });
      });
    }
  });
});
