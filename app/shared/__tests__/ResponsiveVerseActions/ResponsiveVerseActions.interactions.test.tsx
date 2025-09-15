import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderResponsiveVerseActions,
  rerenderResponsiveVerseActions,
} from '@/app/testUtils/responsiveVerseActionsTestUtils';

describe('ResponsiveVerseActions interactions', () => {
  it('should handle play button clicks', async () => {
    const onPlayPause = jest.fn();
    renderResponsiveVerseActions({ onPlayPause });

    const playButton = await screen.findByRole('button', { name: /play/i });
    await act(async () => {
      fireEvent.click(playButton);
    });

    await waitFor(() => {
      expect(onPlayPause).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle bookmark toggle', async () => {
    const onBookmark = jest.fn();
    renderResponsiveVerseActions({ onBookmark, showRemove: true, isBookmarked: true });

    const bookmarkButton = await screen.findByRole('button', { name: /remove bookmark/i });
    await act(async () => {
      fireEvent.click(bookmarkButton);
    });

    await waitFor(() => {
      expect(onBookmark).toHaveBeenCalledTimes(1);
    });
  });

  it('should show correct play/pause state', async () => {
    const { rerender } = renderResponsiveVerseActions();

    await screen.findByRole('button', { name: /play/i });

    await act(async () => {
      rerenderResponsiveVerseActions(rerender, { isPlaying: true });
    });

    await screen.findByRole('button', { name: /pause/i });
  });

  it('should show loading state', async () => {
    renderResponsiveVerseActions({ isLoadingAudio: true });

    await screen.findByLabelText(/loading/i, { selector: 'svg', hidden: true });
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

    const user = userEvent.setup();
    await user.tab();
    await waitFor(() => {
      expect(document.activeElement).not.toBe(playButton);
    });
  });
});
