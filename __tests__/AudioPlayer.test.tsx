import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import AudioPlayer from '@/app/components/AudioPlayer';
import AudioSettingsModal from '@/app/components/AudioSettingsModal';
import { AudioProvider, useAudio, RepeatSettings } from '@/app/context/AudioContext';
import { Verse } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (key === 'speed_option') return String(opts?.rate);
      return key;
    },
  }),
}));

const verse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'test',
};

const PlayerWithVerse = ({ settings }: { settings?: RepeatSettings }) => {
  const { setActiveVerse, setRepeatSettings } = useAudio();
  React.useEffect(() => {
    setActiveVerse(verse);
    if (settings) setRepeatSettings(settings);
  }, [setActiveVerse, settings, setRepeatSettings]);
  return <AudioPlayer />;
};

const ReciterDisplay = () => {
  const { reciter } = useAudio();
  return <div data-testid="reciter">{reciter.name}</div>;
};

beforeEach(() => {
  jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
  jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
  jest.useRealTimers();
});

describe('AudioPlayer', () => {
  it('renders and updates progress', async () => {
    render(
      <AudioProvider>
        <PlayerWithVerse />
      </AudioProvider>
    );
    await act(async () => {});
    expect(await screen.findByText('1:1')).toBeInTheDocument();
    const audio = document.querySelector('audio') as HTMLAudioElement;
    act(() => {
      Object.defineProperty(audio, 'duration', { value: 120, writable: true });
      fireEvent.loadedMetadata(audio);
    });
    act(() => {
      audio.currentTime = 15;
      fireEvent.timeUpdate(audio);
    });
    expect(screen.getByText('0:15')).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('toggles play and pause', async () => {
    render(
      <AudioProvider>
        <PlayerWithVerse />
      </AudioProvider>
    );
    await act(async () => {});
    const button = await screen.findByRole('button', { name: 'pause_audio' });
    fireEvent.click(button);
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'play_audio' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'play_audio' }));
    expect(
      (window.HTMLMediaElement.prototype.play as jest.Mock).mock.calls.length
    ).toBeGreaterThanOrEqual(2);
  });

  it('changes playback speed', async () => {
    render(
      <AudioProvider>
        <PlayerWithVerse />
      </AudioProvider>
    );
    await act(async () => {});
    const select = await screen.findByLabelText('playback_speed');
    fireEvent.change(select, { target: { value: '1.5' } });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.playbackRate).toBe(1.5);
    expect(localStorage.getItem('audioPlaybackRate')).toBe('1.5');
  });

  it('repeats verse according to settings', async () => {
    jest.useFakeTimers();
    render(
      <AudioProvider>
        <PlayerWithVerse
          settings={{ mode: 'single', start: 1, end: 1, playCount: 1, repeatEach: 2, delay: 0 }}
        />
      </AudioProvider>
    );
    await act(async () => {});
    const audio = document.querySelector('audio') as HTMLAudioElement;
    fireEvent.ended(audio);
    act(() => {
      jest.runAllTimers();
    });
    expect((window.HTMLMediaElement.prototype.play as jest.Mock).mock.calls.length).toBeGreaterThan(
      1
    );
  });
});

describe('AudioSettingsModal', () => {
  it('updates reciter when selected', () => {
    render(
      <AudioProvider>
        <ReciterDisplay />
        <AudioSettingsModal isOpen onClose={() => {}} />
      </AudioProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'reciter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mishari Rashid Alafasy' }));
    expect(screen.getByTestId('reciter')).toHaveTextContent('Mishari Rashid Alafasy');
  });
});
