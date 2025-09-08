import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';
import {
  findByTags,
  existsAtPosition,
} from '@/src/infrastructure/repositories/bookmark/advancedUserQueries';
import {
  findFolders,
  findFolderWithBookmarks,
} from '@/src/infrastructure/repositories/bookmark/folderQueries';
import { getStoredBookmarks } from '@/src/infrastructure/repositories/bookmark/storage';
import { findByUser, findRecent } from '@/src/infrastructure/repositories/bookmark/userQueries';

jest.mock('../storage', () => {
  const actual = jest.requireActual('../storage');
  return { ...actual, getStoredBookmarks: jest.fn() };
});

const mockBookmarks = [
  {
    id: '1',
    userId: 'u1',
    verseId: 'v1',
    position: {
      surahId: 1,
      ayahNumber: 1,
      verseKey: '1:1',
      timestamp: '2024-01-01T00:00:00.000Z',
      isFirstVerse: false,
      displayText: '1:1',
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    notes: '',
    tags: ['tag1', 'folder:work'],
  },
  {
    id: '2',
    userId: 'u1',
    verseId: 'v2',
    position: {
      surahId: 1,
      ayahNumber: 2,
      verseKey: '1:2',
      timestamp: '2024-02-01T00:00:00.000Z',
      isFirstVerse: false,
      displayText: '1:2',
    },
    createdAt: '2024-02-01T00:00:00.000Z',
    notes: '',
    tags: ['tag2'],
  },
  {
    id: '3',
    userId: 'u2',
    verseId: 'v3',
    position: {
      surahId: 2,
      ayahNumber: 1,
      verseKey: '2:1',
      timestamp: '2024-03-01T00:00:00.000Z',
      isFirstVerse: false,
      displayText: '2:1',
    },
    createdAt: '2024-03-01T00:00:00.000Z',
    notes: '',
    tags: ['tag1', 'folder:personal'],
  },
];

beforeEach(() => {
  (getStoredBookmarks as jest.Mock).mockReturnValue(mockBookmarks);
});

describe('userQueries', () => {
  test('findByUser sorts by creation date', async () => {
    const result = await findByUser('u1');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('2');
  });

  test('findRecent limits results', async () => {
    const result = await findRecent('u1', 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('findByTags filters by tags', async () => {
    const result = await findByTags('u1', ['tag1']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('existsAtPosition checks for bookmark', async () => {
    const pos = new BookmarkPosition(1, 2, new Date('2024-02-01T00:00:00.000Z'));
    await expect(existsAtPosition('u1', pos)).resolves.toBe(true);
  });
});

describe('folderQueries', () => {
  test('findFolders returns folder names', async () => {
    const result = await findFolders('u1');
    expect(result).toEqual(['work']);
  });

  test('findFolderWithBookmarks returns bookmarks in folder', async () => {
    const result = await findFolderWithBookmarks('u1', 'work');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
