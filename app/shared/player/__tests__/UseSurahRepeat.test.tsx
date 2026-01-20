import { handleSurahRepeat } from '@/app/shared/player/hooks/useSurahRepeat';

describe('handleSurahRepeat', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('restarts the current ayah when repeats remain, honoring delay', () => {
    const seek = jest.fn();
    const play = jest.fn();
    const setVerseRepeatsLeft = jest.fn();

    handleSurahRepeat({
      verseRepeatsLeft: 2,
      playRepeatsLeft: 1,
      repeatEach: 3,
      delay: 500,
      seek,
      play,
      pause: jest.fn(),
      setIsPlaying: jest.fn(),
      setPlayingId: jest.fn(),
      setVerseRepeatsLeft,
      setPlayRepeatsLeft: jest.fn(),
    });

    expect(setVerseRepeatsLeft).toHaveBeenCalledWith(1);
    expect(seek).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(seek).toHaveBeenCalledWith(0);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('cycles through entire surah when play count remains', () => {
    let index = 2;
    const onPrev = jest.fn(() => {
      if (index > 0) {
        index--;
        return index > 0;
      }
      return false;
    });
    const onNext = jest.fn(() => false);
    const seek = jest.fn();
    const play = jest.fn();
    const pause = jest.fn();
    const setIsPlaying = jest.fn();
    const setPlayingId = jest.fn();
    const setVerseRepeatsLeft = jest.fn();
    const setPlayRepeatsLeft = jest.fn();
    handleSurahRepeat({
      verseRepeatsLeft: 1,
      playRepeatsLeft: 2,
      repeatEach: 1,
      delay: 0,
      onNext,
      onPrev,
      seek,
      play,
      pause,
      setIsPlaying,
      setPlayingId,
      setVerseRepeatsLeft,
      setPlayRepeatsLeft,
    });

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(setPlayRepeatsLeft).toHaveBeenCalledWith(1);
    expect(onPrev).toHaveBeenCalledTimes(2);
    expect(index).toBe(0);
  });
});
