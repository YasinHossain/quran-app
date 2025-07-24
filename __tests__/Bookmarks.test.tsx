import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/context/SettingsContext';
import BookmarkedVersesList from '@/app/features/bookmarks/_components/BookmarkedVersesList';
import BookmarksPage from '@/app/features/bookmarks/page';

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

  test('BookmarkedVersesList displays saved bookmarks', () => {
    localStorage.setItem('quranAppBookmarks', JSON.stringify(['1:1', '2:3']));
    render(
      <SettingsProvider>
        <BookmarkedVersesList />
      </SettingsProvider>
    );
    expect(
      screen.getByText('Displaying bookmarked verses: 1:1, 2:3')
    ).toBeInTheDocument();
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
