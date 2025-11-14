'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@/app/shared/Spinner';

import { Verse as VerseComponent } from './VerseCard';

import type { Verse as VerseType } from '@/types';

interface SurahVerseListProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string | undefined;
}

const ESTIMATED_VERSE_HEIGHT = 320;

function findScrollParent(start: HTMLElement | null): HTMLElement | null {
  let node: HTMLElement | null = start?.parentElement ?? null;
  while (node) {
    const style = getComputedStyle(node);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }
  const scrollingElement = document.scrollingElement;
  if (scrollingElement instanceof HTMLElement) {
    return scrollingElement;
  }
  return document.body instanceof HTMLElement ? document.body : null;
}

export const SurahVerseList = ({
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
  emptyLabelKey = 'no_verses_found',
  endLabelKey = 'end_of_surah',
  initialVerseKey,
}: SurahVerseListProps): React.JSX.Element => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const initialScrollRef = useRef<string | null>(null);
  // Track how we last scrolled to allow a second pass once virtualization initializes.
  const lastScrollModeRef = useRef<'none' | 'dom' | 'virtual'>('none');
  const prevShouldVirtualizeRef = useRef<boolean>(false);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const shouldVirtualize = useMemo(
    () => verses.length > 0 && !isLoading && !error && Boolean(scrollElement),
    [verses.length, isLoading, error, scrollElement]
  );

  useLayoutEffect(() => {
    const parent = containerRef.current ? findScrollParent(containerRef.current) : null;
    scrollParentRef.current = parent;
    setScrollElement((previous) => (previous === parent ? previous : parent));
  }, [verses.length]);

  const itemCount = shouldVirtualize ? verses.length : 0;
  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => ESTIMATED_VERSE_HEIGHT,
    overscan: 6,
    getItemKey: (index) => verses[index]?.id ?? `verse-${index}`,
  });

  const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];

  useLayoutEffect(() => {
    if (!shouldVirtualize) return;
    virtualizer.measure();
  }, [shouldVirtualize, virtualizer, verses.length]);

  // Robust auto-scroll: retry briefly until the target verse exists and the list is measured.
  useEffect(() => {
    if (!initialVerseKey) return;

    let attempts = 0;
    let timer: number | null = null;

    const tryScroll = (): void => {
      if (!initialVerseKey) return;
      const didScrollForThisKey = initialScrollRef.current === initialVerseKey;

      const targetIndex = verses.findIndex((verse) => verse.verse_key === initialVerseKey);
      if (targetIndex !== -1) {
        // Scroll behavior rules:
        // - If we haven't scrolled for this key, scroll now (DOM or virtualized).
        // - If we HAVE scrolled using DOM but virtualization just became available,
        //   perform a second scroll using the virtualizer for precise centering.
        if (!didScrollForThisKey || (shouldVirtualize && lastScrollModeRef.current === 'dom')) {
          if (shouldVirtualize) {
            virtualizer.scrollToIndex(targetIndex, { align: 'center' });
            virtualizer.measure();
            initialScrollRef.current = initialVerseKey;
            lastScrollModeRef.current = 'virtual';
          } else {
            const verseId = verses[targetIndex]?.id;
            if (typeof verseId === 'number') {
              const el = document.getElementById(`verse-${verseId}`);
              if (el) {
                const parent = scrollParentRef.current ?? findScrollParent(containerRef.current);
                if (parent && parent instanceof HTMLElement) {
                  // Manually center within the scroll parent for consistent mobile behavior.
                  const elRect = el.getBoundingClientRect();
                  const parentRect = parent.getBoundingClientRect();
                  const currentTop = parent.scrollTop;
                  const delta =
                    elRect.top - parentRect.top - parent.clientHeight / 2 + elRect.height / 2;
                  parent.scrollTo({ top: currentTop + delta, behavior: 'auto' });
                } else {
                  el.scrollIntoView({ block: 'center' });
                }
                initialScrollRef.current = initialVerseKey;
                lastScrollModeRef.current = 'dom';
              }
            }
          }
          return;
        }
        // If already scrolled appropriately, nothing to do.
        return;
      }

      // Verse not yet loaded; retry a few times while pages stream in
      if (attempts < 60) {
        attempts += 1;
        timer = window.setTimeout(tryScroll, 50);
      }
    };

    tryScroll();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [initialVerseKey, shouldVirtualize, verses, virtualizer]);

  // Track the transition into virtualization to enable a second, virtualized scroll pass.
  useEffect(() => {
    prevShouldVirtualizeRef.current = shouldVirtualize;
  }, [shouldVirtualize]);

  return (
    <div ref={containerRef} className="w-full relative">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-accent" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
          {error}
        </div>
      ) : verses.length > 0 ? (
        shouldVirtualize ? (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
            }}
          >
            {virtualItems.map((item) => {
              const style: React.CSSProperties = {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${item.start}px)`,
              };

              const verse = verses[item.index];
              if (!verse) return null;

              return (
                <div
                  key={item.key}
                  data-index={item.index}
                  ref={virtualizer.measureElement}
                  style={style}
                  className="pb-4"
                >
                  <VerseComponent verse={verse} />
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {verses.map((v) => (
              <React.Fragment key={v.id}>
                <VerseComponent verse={v} />
              </React.Fragment>
            ))}
          </>
        )
      ) : (
        <div className="text-center py-20 text-muted">{t(emptyLabelKey)}</div>
      )}
      {verses.length > 0 ? (
        <div ref={loadMoreRef} className="py-4 text-center space-x-2">
          {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
          {isReachingEnd && <span className="text-muted">{t(endLabelKey)}</span>}
        </div>
      ) : null}
    </div>
  );
};
