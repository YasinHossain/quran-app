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

  it('shows initial skeleton values', () => {
    render(<CleanPlayer />);
    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.src).toBe('');
    expect(screen.getAllByText('0:00').length).toBe(2);
  });

  it('plays and pauses audio', async () => {
    render(<CleanPlayer src="track.mp3" title="Test" />);
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

  it('seeks using the slider', () => {
    render(<CleanPlayer src="track.mp3" title="Test" />);
    const audio = document.querySelector('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'duration', { value: 100, writable: true });
    act(() => {
      audio.dispatchEvent(new Event('loadedmetadata'));
    });
    const slider = screen.getByRole('slider');
    act(() => {
      fireEvent.change(slider, { target: { value: '10' } });
    });
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('10');
  });

  it('persists mute state across rerenders', () => {
    const { rerender } = render(<CleanPlayer src="track.mp3" title="Test" />);
    const muteButton = screen.getByRole('button', { name: 'toggle_mute' });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    fireEvent.click(muteButton);
    expect(audio.muted).toBe(true);

    rerender(<CleanPlayer src="track.mp3" title="Test" />);
    const audioAgain = document.querySelector('audio') as HTMLAudioElement;
    expect(audioAgain.muted).toBe(true);
  });

  it('opens repeat mode and toggles loop', () => {
    render(<CleanPlayer src="track.mp3" title="Test" />);
    const repeatButton = screen.getByRole('button', { name: 'toggle_repeat' });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.loop).toBe(false);
    fireEvent.click(repeatButton);
    expect(audio.loop).toBe(true);
    fireEvent.click(repeatButton);
    expect(audio.loop).toBe(false);
  });

  it('handles ended event by resetting to play state', () => {
    render(<CleanPlayer src="track.mp3" title="Test" />);
    const audio = document.querySelector('audio') as HTMLAudioElement;
    act(() => {
      audio.dispatchEvent(new Event('ended'));
    });
    const playButton = screen.getByRole('button', { name: 'play_audio' });
    expect(playButton).toBeInTheDocument();
  });

  it('renders icons with correct size and stroke', () => {
    const { container } = render(<CleanPlayer src="track.mp3" title="Test" />);
    const icons = container.querySelectorAll('svg');
    icons.forEach((icon) => {
      expect(icon).toHaveClass('h-5', 'w-5');
      expect(icon.getAttribute('stroke-width')).toBe('2');
    });
  });

  it('shows options and speed controls', () => {
    render(<CleanPlayer src="track.mp3" title="Test" />);
    expect(screen.getByRole('button', { name: 'audio_settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'microphone' })).toBeInTheDocument();
  });
});
