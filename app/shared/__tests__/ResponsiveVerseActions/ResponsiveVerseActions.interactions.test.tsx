import { screen, fireEvent } from '@testing-library/react';

import { renderResponsiveVerseActions, rerenderResponsiveVerseActions } from './test-helpers';

describe('ResponsiveVerseActions interactions', () => {
  it('should handle play button clicks', () => {
    const onPlayPause = jest.fn();
    renderResponsiveVerseActions({ onPlayPause });

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it('should handle bookmark toggle', () => {
    const onBookmark = jest.fn();
    renderResponsiveVerseActions({ onBookmark });

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkButton);

    expect(onBookmark).toHaveBeenCalledTimes(1);
  });

  it('should show correct play/pause state', () => {
    const { rerender } = renderResponsiveVerseActions();

    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();

    rerenderResponsiveVerseActions(rerender, { isPlaying: true });

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('should show loading state', () => {
    renderResponsiveVerseActions({ isLoadingAudio: true });

    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
  });

  it('should show bookmarked state', () => {
    renderResponsiveVerseActions({ isBookmarked: true });

    expect(screen.getByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    renderResponsiveVerseActions();

    const playButton = screen.getByRole('button', { name: /play/i });
    screen.getByRole('button', { name: /bookmark/i });

    playButton.focus();
    expect(document.activeElement).toBe(playButton);

    fireEvent.keyDown(playButton, { key: 'Tab' });
    expect(document.activeElement).not.toBe(playButton);
  });
});
