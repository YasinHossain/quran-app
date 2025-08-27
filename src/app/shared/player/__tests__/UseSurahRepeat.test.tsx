import { handleSurahRepeat } from '@/presentation/shared/player/hooks/useSurahRepeat';

describe('handleSurahRepeat', () => {
  it('cycles through entire surah when repeating', () => {
    jest.useFakeTimers();
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

    expect(onPrev).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).toHaveBeenCalledTimes(2);
    expect(index).toBe(0);
  });
});
