'use client';

import React from 'react';
import { Virtuoso } from 'react-virtuoso';

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
// ...
  renderItem: (bm: Bookmark, index: number) => React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className="w-full h-full relative" ref={setRootRef}>
      <Virtuoso
        useWindowScroll={!scrollElement}
        {...(scrollElement ? { customScrollParent: scrollElement } : {})}
        data={bookmarks}
        itemContent={(index, bookmark) => renderItem(bookmark, index)}
        computeItemKey={(index, bookmark) =>
          `bookmark-${bookmark.verseId}-${bookmark.verseKey ?? index}`
        }
        increaseViewportBy={1000}
      />
    </div>
  );
};
