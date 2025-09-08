import { render, screen, act } from '@testing-library/react';
import React from 'react';

import PlayerOptions from '../components/PlayerOptions';
import Timeline from '../components/Timeline';
import { AudioProvider } from '../context/AudioContext';

describe('Player components mobile layout', () => {
  beforeAll(() => {
    // Mock ResizeObserver used by Radix UI components
    class ResizeObserverMock {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  });

  test('renders options icon and progress bar on small viewports', async () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    await act(async () => {
      render(
        <AudioProvider>
          <div>
            <PlayerOptions />
            <Timeline
              current={0}
              duration={10}
              setSeek={() => {}}
              interactable
              elapsed="0:00"
              total="0:10"
            />
          </div>
        </AudioProvider>
      );
    });
    expect(screen.getByLabelText('Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Seek')).toBeInTheDocument();
  });
});
