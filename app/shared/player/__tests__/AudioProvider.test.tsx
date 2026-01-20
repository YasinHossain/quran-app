import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { AudioProvider, useAudio } from '@/app/shared/player/context/AudioContext';

const TEST_RECITER_ID = 3; // Abdur-Rahman as-Sudais

const Consumer = (): React.ReactElement => {
  const { reciter, volume, playbackRate, setReciterId, setVolume, setPlaybackRate } = useAudio();
  return (
    <>
      <div data-testid="reciter">{reciter.id}</div>
      <div data-testid="volume">{volume}</div>
      <div data-testid="playbackRate">{playbackRate}</div>
      <button onClick={() => setReciterId(TEST_RECITER_ID)}>reciter</button>
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
    expect(localStorage.getItem('reciterId')).toBe(String(TEST_RECITER_ID));
    expect(localStorage.getItem('volume')).toBe('0.5');
    expect(localStorage.getItem('playbackRate')).toBe('1.5');
  });

  unmount();

  const { getByTestId } = render(
    <AudioProvider>
      <Consumer />
    </AudioProvider>
  );

  expect(getByTestId('reciter').textContent).toBe(String(TEST_RECITER_ID));
  expect(getByTestId('volume').textContent).toBe('0.5');
  expect(getByTestId('playbackRate').textContent).toBe('1.5');
});
