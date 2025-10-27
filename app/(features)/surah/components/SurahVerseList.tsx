'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
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
  return null;
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
}: SurahVerseListProps): React.JSX.Element => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const shouldVirtualize = useMemo(
    () => verses.length > 0 && !isLoading && !error,
    [verses.length, isLoading, error]
  );

  useLayoutEffect(() => {
    scrollParentRef.current = containerRef.current ? findScrollParent(containerRef.current) : null;
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
