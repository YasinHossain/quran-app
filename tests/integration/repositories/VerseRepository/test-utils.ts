import * as apiVerses from '../../../../lib/api/verses';
import { VerseRepository } from '../../../../src/infrastructure/repositories/VerseRepository';
import { Verse } from '../../../../types';

jest.mock('../../../../lib/api/verses', () => ({
  getVerseById: jest.fn(),
  getVerseByKey: jest.fn(),
  getVersesByChapter: jest.fn(),
  getVersesByJuz: jest.fn(),
  getVersesByPage: jest.fn(),
  searchVerses: jest.fn(),
  getRandomVerse: jest.fn(),
}));

export const mockApiVerses = apiVerses as jest.Mocked<typeof apiVerses>;

export const createRepository = () => new VerseRepository();

export const mockApiVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  translations: [
    {
      id: 131,
      resource_id: 131,
      text: 'In the name of Allah, the Beneficent, the Merciful.',
    },
  ],
};
