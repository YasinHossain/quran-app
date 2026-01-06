'use client';

import { useAudioWordSync, type SelectorBuilder } from '@/app/shared/player/hooks/useAudioWordSync';

const HIGHLIGHT_CLASS = 'word-audio-highlight';

const selectorBuilder: SelectorBuilder = (verseKey, activeWord, cssEscape) => {
  return `[data-verse-word="true"][data-verse-key="${cssEscape(
    verseKey
  )}"][data-word-position="${activeWord}"]`;
};

export function useVerseAudioWordSync(): void {
  useAudioWordSync({
    highlightClass: HIGHLIGHT_CLASS,
    selectorBuilder,
  });
}
