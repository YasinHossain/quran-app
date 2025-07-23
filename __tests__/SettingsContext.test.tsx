import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from '@/app/context/SettingsContext';

const BookmarkTest = () => {
  const { bookmarkedVerses, toggleBookmark } = useSettings();
  return (
    <div>
      <div data-testid="bookmarks">{JSON.stringify(bookmarkedVerses)}</div>
      <button onClick={() => toggleBookmark('1:1')}>Toggle</button>
    </div>
  );
};

describe('SettingsContext bookmarks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a verse ID to bookmarks via toggleBookmark', async () => {
    render(
      <SettingsProvider>
        <BookmarkTest />
      </SettingsProvider>
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByTestId('bookmarks').textContent).toBe(JSON.stringify(['1:1']));
      expect(JSON.parse(localStorage.getItem('quranAppBookmarks') || '[]')).toEqual(['1:1']);
    });
  });

  it('persists bookmarks in localStorage across renders', async () => {
    const { unmount } = render(
      <SettingsProvider>
        <BookmarkTest />
      </SettingsProvider>
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('quranAppBookmarks') || '[]')).toEqual(['1:1']);
    });
    unmount();

    render(
      <SettingsProvider>
        <BookmarkTest />
      </SettingsProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('bookmarks').textContent).toBe(JSON.stringify(['1:1']));
    });
  });
});
