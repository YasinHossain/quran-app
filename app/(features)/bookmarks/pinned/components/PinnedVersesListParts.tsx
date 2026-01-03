'use client';

import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import { VerseSkeleton } from '@/app/shared/components/VerseSkeleton';
import { PinIcon } from '@/app/shared/icons';
import { LoadingStatus } from '@/app/shared/LoadingStatus';

import { PinnedVerseListItem } from './PinnedItem';

import type { Bookmark } from '@/types';

export const WORKSPACE_SCROLL_SELECTOR =
  '[data-slot="bookmarks-landing-main"], [data-slot="workspace-main"], [data-slot="bookmarks-workspace-main"]';

export function PinnedLoading(): React.JSX.Element {
  return (
    <LoadingStatus>
      <VerseSkeleton index={0} />
      <VerseSkeleton index={1} />
      <VerseSkeleton index={2} />
    </LoadingStatus>
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
  return (
    <div className="relative w-full h-full" ref={setRootRef}>
      <Virtuoso
        useWindowScroll={!scrollElement}
        customScrollParent={scrollElement ?? undefined}
        data={bookmarks}
        computeItemKey={(index, bookmark) =>
          `pinned-${index}-${bookmark.verseId}-${bookmark.createdAt ?? index}`
        }
        itemContent={(index, bookmark) => (
          <PinnedVerseListItem bookmark={bookmark} index={index} />
        )}
        increaseViewportBy={1000}
      />
    </div>
  );
}
