import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import BookmarkedVersesList from '@/app/(features)/bookmarks/components/BookmarkedVersesList';
import BookmarksPage from '@/app/(features)/bookmarks/page';
import * as api from '@/lib/api';
import { Verse } from '@/types';

jest.mock('@/lib/api');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Bookmarked verses components', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('BookmarkedVersesList shows empty message', () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkedVersesList />
        </BookmarkProvider>
      </SettingsProvider>
    );
    expect(screen.getByText('No verses bookmarked yet.')).toBeInTheDocument();
  });

  test('BookmarkedVersesList renders fetched verses', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'verse text',
      translations: [{ resource_id: 20, text: 'translation' }],
    } as Verse;
    (api.getVerseById as jest.Mock).mockResolvedValue(mockVerse);
    localStorage.setItem('quranAppBookmarks', JSON.stringify(['1']));
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkedVersesList />
        </BookmarkProvider>
      </SettingsProvider>
    );
    expect(await screen.findByText('translation')).toBeInTheDocument();
  });

  test('BookmarkedVersesList shows error message on failure', async () => {
    (api.getVerseById as jest.Mock).mockRejectedValue(new Error('boom'));
    localStorage.setItem('quranAppBookmarks', JSON.stringify(['1']));
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkedVersesList />
        </BookmarkProvider>
      </SettingsProvider>
    );
    expect(await screen.findByText('Failed to load bookmarked verses. boom')).toBeInTheDocument();
  });

  test('BookmarksPage renders heading', () => {
    render(
      <ThemeProvider>
        <SettingsProvider>
          <BookmarkProvider>
            <SidebarProvider>
              <BookmarksPage />
            </SidebarProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </ThemeProvider>
    );
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
  });
});
