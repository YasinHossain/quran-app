import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { CleanPlayer } from '@/app/components/player';

describe('CleanPlayer', () => {
  beforeEach(() => {
    jest
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());
    jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('toggles play and pause', async () => {
    render(<CleanPlayer src="test.mp3" title="Test" />);
    const playButton = screen.getByRole('button', { name: 'play_audio' });
    await act(async () => {
      fireEvent.click(playButton);
    });
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    const pauseButton = await screen.findByRole('button', { name: 'pause_audio' });
    await act(async () => {
      fireEvent.click(pauseButton);
    });
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
});
