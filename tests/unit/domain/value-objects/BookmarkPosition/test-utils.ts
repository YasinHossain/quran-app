import { BookmarkPosition } from '../../../../../src/domain/value-objects/BookmarkPosition';

export const validSurahId = 1;
export const validAyahNumber = 1;
export const validTimestamp = new Date('2024-01-01T10:00:00Z');

export const expectBookmarkPositionToThrow = (
  surahId: number,
  ayahNumber: number,
  timestamp: Date | null | undefined,
  expectedMessage: string
) => {
  const createPosition = () => new BookmarkPosition(surahId, ayahNumber, timestamp as Date);
  expect(createPosition).toThrow(expectedMessage);
};
