import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('toggles mute', () => {
    render(<CleanPlayer src="test.mp3" title="Test" />);
    const muteButton = screen.getByRole('button', { name: 'toggle_mute' });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.muted).toBe(false);
    fireEvent.click(muteButton);
    expect(audio.muted).toBe(true);
    fireEvent.click(muteButton);
    expect(audio.muted).toBe(false);
  });

  it('toggles repeat', () => {
    render(<CleanPlayer src="test.mp3" title="Test" />);
    const repeatButton = screen.getByRole('button', { name: 'toggle_repeat' });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.loop).toBe(false);
    fireEvent.click(repeatButton);
    expect(audio.loop).toBe(true);
  });

  it('calls onError when audio fails', () => {
    const onError = jest.fn();
    render(<CleanPlayer src="test.mp3" onError={onError} />);
    const audio = document.querySelector('audio') as HTMLAudioElement;
    fireEvent.error(audio);
    expect(onError).toHaveBeenCalledWith('could_not_play_audio');
  });
});
