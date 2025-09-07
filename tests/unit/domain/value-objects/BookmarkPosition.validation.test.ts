import {
  validSurahId,
  validAyahNumber,
  validTimestamp,
  expectBookmarkPositionToThrow,
} from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition constructor validation', () => {
  it('creates a valid BookmarkPosition with all parameters', () => {
    const position = new BookmarkPosition(validSurahId, validAyahNumber, validTimestamp);
    expect(position.surahId).toBe(validSurahId);
    expect(position.ayahNumber).toBe(validAyahNumber);
    expect(position.timestamp).toBe(validTimestamp);
  });

  it('throws error for invalid Surah ID below 1', () => {
    expectBookmarkPositionToThrow(
      0,
      validAyahNumber,
      validTimestamp,
      'Invalid Surah ID: must be between 1 and 114'
    );
  });

  it('throws error for invalid Surah ID above 114', () => {
    expectBookmarkPositionToThrow(
      115,
      validAyahNumber,
      validTimestamp,
      'Invalid Surah ID: must be between 1 and 114'
    );
  });

  it('throws error for invalid Ayah number below 1', () => {
    expectBookmarkPositionToThrow(validSurahId, 0, validTimestamp, 'Ayah number must be positive');
  });

  it('throws error when timestamp is null/undefined', () => {
    expectBookmarkPositionToThrow(validSurahId, validAyahNumber, null, 'Timestamp is required');
    expectBookmarkPositionToThrow(
      validSurahId,
      validAyahNumber,
      undefined,
      'Timestamp is required'
    );
  });
});
