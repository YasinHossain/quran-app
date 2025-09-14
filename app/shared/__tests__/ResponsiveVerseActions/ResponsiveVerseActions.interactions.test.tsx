import { screen, fireEvent, waitFor } from '@testing-library/react';

import {
  renderResponsiveVerseActions,
  rerenderResponsiveVerseActions,
} from '@/app/testUtils/responsiveVerseActionsTestUtils';

describe('ResponsiveVerseActions interactions', () => {
  it('should handle play button clicks', async () => {
    const onPlayPause = jest.fn();
    renderResponsiveVerseActions({ onPlayPause });

    const playButton = await screen.findByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(onPlayPause).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle bookmark toggle', async () => {
    const onBookmark = jest.fn();
    renderResponsiveVerseActions({ onBookmark });

    const bookmarkButton = await screen.findByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(onBookmark).toHaveBeenCalledTimes(1);
    });
  });

  it('should show correct play/pause state', async () => {
    const { rerender } = renderResponsiveVerseActions();

    await screen.findByRole('button', { name: /play/i });

    rerenderResponsiveVerseActions(rerender, { isPlaying: true });

    await screen.findByRole('button', { name: /pause/i });
  });

  it('should show loading state', async () => {
    renderResponsiveVerseActions({ isLoadingAudio: true });

    await screen.findByRole('button', { name: /loading/i });
  });

  it('should show bookmarked state', async () => {
    renderResponsiveVerseActions({ isBookmarked: true });

    await screen.findByRole('button', { name: /remove bookmark/i });
  });

  it('should support keyboard navigation', async () => {
    renderResponsiveVerseActions();

    const playButton = await screen.findByRole('button', { name: /play/i });
    await screen.findByRole('button', { name: /bookmark/i });

    playButton.focus();
    expect(document.activeElement).toBe(playButton);

    fireEvent.keyDown(playButton, { key: 'Tab' });
    await waitFor(() => {
      expect(document.activeElement).not.toBe(playButton);
    });
  });
});
