'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { PinIcon } from '@/app/shared/icons';
import { Spinner } from '@/app/shared/Spinner';

import { PinnedVerseListItem } from './PinnedItem';

import type { Bookmark } from '@/types';

export const WORKSPACE_SCROLL_SELECTOR =
  '[data-slot="bookmarks-landing-main"], [data-slot="workspace-main"], [data-slot="bookmarks-workspace-main"]';

export function PinnedLoading(): React.JSX.Element {
  return (
    <div className="flex justify-center py-20">
      <Spinner className="h-8 w-8 text-accent" />
    </div>
  );
}

export function PinnedEmptyState(): React.JSX.Element {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <PinIcon size={32} className="text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Pinned Verses</h3>
      <p className="text-muted max-w-md mx-auto">
        Pin your favorite verses while reading to access them quickly from here.
      </p>
    </div>
  );
}

export function useWorkspaceScrollRef(): {
  scrollElement: HTMLElement | null;
  setRootRef: (node: HTMLDivElement | null) => void;
} {
  const [scrollElement, setScrollElement] = React.useState<HTMLElement | null>(null);

  const setRootRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      setScrollElement(null);
      return;
    }
    const workspaceScroll = node.closest<HTMLElement>(WORKSPACE_SCROLL_SELECTOR);
    if (workspaceScroll) setScrollElement(workspaceScroll);
  }, []);

  return { scrollElement, setRootRef };
}

export function VirtualizedPinnedList({
  bookmarks,
  scrollElement,
  setRootRef,
}: {
  bookmarks: Bookmark[];
  scrollElement: HTMLElement | null;
  setRootRef: (node: HTMLDivElement | null) => void;
}): React.JSX.Element {
  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 360,
    overscan: 6,
    getItemKey: (index) => {
      const bookmark = bookmarks[index];
      if (!bookmark) return index;
      return `pinned-${bookmark.verseId}-${bookmark.verseKey ?? index}`;
    },
  });

  return (
    <div className="relative w-full" ref={setRootRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const bookmark = bookmarks[virtualItem.index];
          if (!bookmark) return null;
          return (
            <div
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              <PinnedVerseListItem bookmark={bookmark} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// end of file
