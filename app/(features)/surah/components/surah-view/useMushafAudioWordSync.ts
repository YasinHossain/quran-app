'use client';

import { useAudioWordSync, type SelectorBuilder } from '@/app/shared/player/hooks/useAudioWordSync';

const HIGHLIGHT_CLASS = 'mushaf-audio-highlight';

const selectorBuilder: SelectorBuilder = (verseKey, activeWord, cssEscape) => {
  return `[data-mushaf-word="true"][data-verse-key="${cssEscape(
    verseKey
  )}"][data-word-position="${activeWord}"]`;
};

export function useMushafAudioWordSync(): void {
  useAudioWordSync({
    highlightClass: HIGHLIGHT_CLASS,
    selectorBuilder,
  });
}
