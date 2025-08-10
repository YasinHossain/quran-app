import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import BookmarkedVersesList from '../components/BookmarkedVersesList';
import BookmarksPage from '../page';
import * as api from '@/lib/api';
import { Verse } from '@/types';

jest.mock('@/lib/api');

describe('Bookmarked verses components', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('BookmarkedVersesList shows empty message', () => {
    render(
      <SettingsProvider>
        <BookmarkedVersesList />
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
        <BookmarkedVersesList />
      </SettingsProvider>
    );
    expect(await screen.findByText('translation')).toBeInTheDocument();
  });

  test('BookmarkedVersesList shows error message on failure', async () => {
    (api.getVerseById as jest.Mock).mockRejectedValue(new Error('boom'));
    localStorage.setItem('quranAppBookmarks', JSON.stringify(['1']));
    render(
      <SettingsProvider>
        <BookmarkedVersesList />
      </SettingsProvider>
    );
    expect(await screen.findByText('Failed to load bookmarked verses. boom')).toBeInTheDocument();
  });

  test('BookmarksPage renders heading', () => {
    render(
      <SettingsProvider>
        <BookmarksPage />
      </SettingsProvider>
    );
    expect(screen.getByText('Bookmarked Verses')).toBeInTheDocument();
  });
});
