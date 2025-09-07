import { Surah } from '../../../../src/domain/entities';
import {
  validId,
  validName,
  validArabicName,
  validEnglishName,
  validEnglishTranslation,
  validNumberOfAyahs,
  validRevelationType,
  validRevelationOrder,
} from './Surah/test-utils';

describe('Surah Entity - Constructor', () => {
  it('should create a valid Surah with all required parameters', () => {
    const surah = new Surah(validId, validName, validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType);
    expect(surah.id).toBe(validId);
    expect(surah.name).toBe(validName);
    expect(surah.arabicName).toBe(validArabicName);
    expect(surah.englishName).toBe(validEnglishName);
    expect(surah.englishTranslation).toBe(validEnglishTranslation);
    expect(surah.numberOfAyahs).toBe(validNumberOfAyahs);
    expect(surah.revelationType).toBe(validRevelationType);
    expect(surah.revelationOrder).toBeUndefined();
  });

  it('should create a Surah with revelation order', () => {
    const surah = new Surah(validId, validName, validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType, validRevelationOrder);
    expect(surah.revelationOrder).toBe(validRevelationOrder);
  });

  it('should throw error for invalid Surah ID (below 1)', () => {
    expect(() => new Surah(0, validName, validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType)).toThrow(
      'Invalid Surah ID: must be between 1 and 114',
    );
  });

  it('should throw error for invalid Surah ID (above 114)', () => {
    expect(() => new Surah(115, validName, validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType)).toThrow(
      'Invalid Surah ID: must be between 1 and 114',
    );
  });

  it('should throw error for empty name', () => {
    expect(() => new Surah(validId, '', validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType)).toThrow(
      'Surah name cannot be empty',
    );
  });

  it('should throw error for whitespace-only name', () => {
    expect(() => new Surah(validId, '   ', validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType)).toThrow(
      'Surah name cannot be empty',
    );
  });

  it('should throw error for empty Arabic name', () => {
    expect(() => new Surah(validId, validName, '', validEnglishName, validEnglishTranslation, validNumberOfAyahs, validRevelationType)).toThrow(
      'Arabic name cannot be empty',
    );
  });

  it('should throw error for empty English name', () => {
    expect(() => new Surah(validId, validName, validArabicName, '', validEnglishTranslation, validNumberOfAyahs, validRevelationType)).toThrow(
      'English name cannot be empty',
    );
  });

  it('should throw error for invalid number of ayahs (below 1)', () => {
    expect(() => new Surah(validId, validName, validArabicName, validEnglishName, validEnglishTranslation, 0, validRevelationType)).toThrow(
      'Number of ayahs must be positive',
    );
  });
});
