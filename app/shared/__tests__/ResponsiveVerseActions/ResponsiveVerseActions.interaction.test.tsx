import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { ResponsiveVerseActions } from '../../ResponsiveVerseActions';
import { defaultProps } from './test-helpers';

describe('ResponsiveVerseActions interaction', () => {
  it('should handle play button clicks', () => {
    const onPlayPause = jest.fn();
    render(<ResponsiveVerseActions {...defaultProps} onPlayPause={onPlayPause} />);

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it('should handle bookmark toggle', () => {
    const onBookmark = jest.fn();
    render(<ResponsiveVerseActions {...defaultProps} onBookmark={onBookmark} />);

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkButton);

    expect(onBookmark).toHaveBeenCalledTimes(1);
  });

  it('should show correct play/pause state', () => {
    const { rerender } = render(<ResponsiveVerseActions {...defaultProps} />);

    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();

    rerender(<ResponsiveVerseActions {...defaultProps} isPlaying={true} />);

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<ResponsiveVerseActions {...defaultProps} isLoadingAudio={true} />);

    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
  });

  it('should show bookmarked state', () => {
    render(<ResponsiveVerseActions {...defaultProps} isBookmarked={true} />);

    const bookmarkButton = screen.getByRole('button', { name: /remove bookmark/i });
    expect(bookmarkButton).toBeInTheDocument();
  });
});
