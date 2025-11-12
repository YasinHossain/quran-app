'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import type { Bookmark } from '@/types';

const WORKSPACE_SCROLL_SELECTOR =
  '[data-slot="bookmarks-landing-main"], [data-slot="workspace-main"], [data-slot="bookmarks-workspace-main"]';

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

export const VirtualizedBookmarkList = ({
  bookmarks,
  scrollElement,
  setRootRef,
  renderItem,
}: {
  bookmarks: Bookmark[];
  scrollElement: HTMLElement | null;
  setRootRef: (node: HTMLDivElement | null) => void;
  renderItem: (bm: Bookmark) => React.ReactNode;
}): React.JSX.Element => {
  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 360,
    overscan: 6,
    getItemKey: (index) => {
      const bm = bookmarks[index];
      if (!bm) return index;
      return `bookmark-${bm.verseId}-${bm.verseKey ?? index}`;
    },
  });

  return (
    <div className="w-full relative" ref={setRootRef}>
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
            <BookmarkVirtualRow
              key={virtualItem.key}
              virtualStart={virtualItem.start}
              refFn={rowVirtualizer.measureElement}
            >
              {renderItem(bookmark)}
            </BookmarkVirtualRow>
          );
        })}
      </div>
    </div>
  );
};

export const BookmarkVirtualRow = ({
  children,
  virtualStart,
  refFn,
}: {
  children: React.ReactNode;
  virtualStart: number;
  refFn: (el: Element | null) => void;
}): React.JSX.Element => (
  <div
    ref={refFn}
    className="absolute left-0 top-0 w-full"
    style={{ transform: `translateY(${virtualStart}px)` }}
  >
    {children}
  </div>
);
