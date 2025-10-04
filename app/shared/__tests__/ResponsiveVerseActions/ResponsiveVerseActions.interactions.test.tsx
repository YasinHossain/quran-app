import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderResponsiveVerseActions,
  rerenderResponsiveVerseActions,
} from '@/app/testUtils/responsiveVerseActionsTestUtils';

describe('ResponsiveVerseActions interactions · playback', () => {
  it('handles play button clicks', async () => {
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

  it('reflects play/pause state', async () => {
    const { rerender } = renderResponsiveVerseActions();

    await screen.findByRole('button', { name: /play/i });

    await act(async () => {
      rerenderResponsiveVerseActions(rerender, { isPlaying: true });
    });

    await screen.findByRole('button', { name: /pause/i });
  });

  it('toggles play and pause on user interaction', async () => {
    const onPlayPause = jest.fn();
    const { rerender } = renderResponsiveVerseActions({ onPlayPause });

    const user = userEvent.setup();
    const playButton = await screen.findByRole('button', { name: /play/i });
    await user.click(playButton);
    expect(onPlayPause).toHaveBeenCalledTimes(1);

    rerenderResponsiveVerseActions(rerender, { isPlaying: true, onPlayPause });
    const pauseButton = await screen.findByRole('button', { name: /pause/i });
    await user.click(pauseButton);
    expect(onPlayPause).toHaveBeenCalledTimes(2);
  });
});

describe('ResponsiveVerseActions interactions · bookmarking', () => {
  it('handles bookmark toggle', async () => {
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

  it('shows bookmarked state', async () => {
    renderResponsiveVerseActions({ isBookmarked: true });

    await screen.findByRole('button', { name: /remove bookmark/i });
  });
});

describe('ResponsiveVerseActions interactions · accessibility', () => {
  it('shows loading state', async () => {
    renderResponsiveVerseActions({ isLoadingAudio: true });

    await screen.findByLabelText(/loading/i, { selector: 'svg' });
  });

  it('supports keyboard navigation', async () => {
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
