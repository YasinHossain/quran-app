import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { AudioProvider, useAudio } from '../context/AudioContext';
import { RECITERS } from '@/lib/audio/reciters';

const Consumer = () => {
  const { reciter, volume, playbackRate, setReciter, setVolume, setPlaybackRate } = useAudio();
  return (
    <>
      <div data-testid="reciter">{reciter.id}</div>
      <div data-testid="volume">{volume}</div>
      <div data-testid="playbackRate">{playbackRate}</div>
      <button onClick={() => setReciter(RECITERS[2])}>reciter</button>
      <button onClick={() => setVolume(0.5)}>volume</button>
      <button onClick={() => setPlaybackRate(1.5)}>playbackRate</button>
    </>
  );
};

test('settings persist after reload', async () => {
  localStorage.clear();

  const { getByText, unmount } = render(
    <AudioProvider>
      <Consumer />
    </AudioProvider>
  );

  fireEvent.click(getByText('reciter'));
  fireEvent.click(getByText('volume'));
  fireEvent.click(getByText('playbackRate'));

  await waitFor(() => {
    expect(localStorage.getItem('reciterId')).toBe(String(RECITERS[2].id));
    expect(localStorage.getItem('volume')).toBe('0.5');
    expect(localStorage.getItem('playbackRate')).toBe('1.5');
  });

  unmount();

  const { getByTestId } = render(
    <AudioProvider>
      <Consumer />
    </AudioProvider>
  );

  expect(getByTestId('reciter').textContent).toBe(String(RECITERS[2].id));
  expect(getByTestId('volume').textContent).toBe('0.5');
  expect(getByTestId('playbackRate').textContent).toBe('1.5');
});
