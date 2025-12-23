import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';

import { findScrollParent } from './useVerseListVirtualization';

import type { Verse as VerseType } from '@/types';
import type { Virtualizer } from '@tanstack/react-virtual';

interface ScrollArgs {
  verses: VerseType[];
  index: number;
  containerRef: RefObject<HTMLDivElement | null>;
  scrollParentRef: MutableRefObject<HTMLElement | null>;
}

interface UseInitialVerseScrollParams {
  initialVerseKey?: string | undefined;
  verses: VerseType[];
  shouldVirtualize: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  virtualizer: Virtualizer<any, Element>;
  containerRef: RefObject<HTMLDivElement | null>;
  scrollParentRef: MutableRefObject<HTMLElement | null>;
}

function scrollDomToVerse({ verses, index, containerRef, scrollParentRef }: ScrollArgs): boolean {
  const verseId = verses[index]?.id;
  if (typeof verseId !== 'number') return false;

  const target = document.getElementById(`verse-${verseId}`);
  if (!target) return false;

  const parent = scrollParentRef.current ?? findScrollParent(containerRef.current);
  if (parent && parent instanceof HTMLElement) {
    const elRect = target.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const delta = elRect.top - parentRect.top - parent.clientHeight / 2 + elRect.height / 2;
    parent.scrollTo({ top: parent.scrollTop + delta, behavior: 'auto' });
  } else {
    target.scrollIntoView({ block: 'center' });
  }

  return true;
}

function scrollWithVirtualizer(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  virtualizer: Virtualizer<any, Element>,
  index: number
): boolean {
  virtualizer.scrollToIndex(index, { align: 'center' });
  virtualizer.measure();
  return true;
}

export function useInitialVerseScroll({
  initialVerseKey,
  verses,
  shouldVirtualize,
  virtualizer,
  containerRef,
  scrollParentRef,
}: UseInitialVerseScrollParams): void {
  const initialScrollRef = useRef<string | null>(null);
  const lastScrollModeRef = useRef<'none' | 'dom' | 'virtual'>('none');

  useEffect(() => {
    if (!initialVerseKey) return;

    let attempts = 0;
    let timer: number | null = null;

    const tryScroll = (): void => {
      if (!initialVerseKey) return;
      const alreadyVirtual =
        initialScrollRef.current === initialVerseKey && lastScrollModeRef.current === 'virtual';
      if (alreadyVirtual) return;

      const targetIndex = verses.findIndex((verse) => verse.verse_key === initialVerseKey);
      if (targetIndex !== -1) {
        const didScroll = shouldVirtualize
          ? scrollWithVirtualizer(virtualizer, targetIndex)
          : scrollDomToVerse({ verses, index: targetIndex, containerRef, scrollParentRef });

        if (didScroll) {
          initialScrollRef.current = initialVerseKey;
          lastScrollModeRef.current = shouldVirtualize ? 'virtual' : 'dom';
          return;
        }
      }

      if (attempts < 60) {
        attempts += 1;
        timer = window.setTimeout(tryScroll, 50);
      }
    };

    tryScroll();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [initialVerseKey, shouldVirtualize, verses, virtualizer, containerRef, scrollParentRef]);
}
