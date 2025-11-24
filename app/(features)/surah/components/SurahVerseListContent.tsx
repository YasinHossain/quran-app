import React from 'react';

import { Spinner } from '@/app/shared/Spinner';

import { Verse as VerseComponent } from './VerseCard';

import type { Verse as VerseType } from '@/types';
import type { VirtualItem } from '@tanstack/react-virtual';
interface VerseListBodyProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  emptyLabel: string;
  shouldVirtualize: boolean;
  virtualItems: VirtualItem[];
  totalHeight: number;
  measureElement: (element: Element | null) => void;
}

export const VerseListBody = ({
  verses,
  isLoading,
  error,
  emptyLabel,
  shouldVirtualize,
  virtualItems,
  totalHeight,
  measureElement,
}: VerseListBodyProps): React.JSX.Element => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (verses.length === 0) return <EmptyState label={emptyLabel} />;
  if (shouldVirtualize) {
    return (
      <VirtualizedList
        verses={verses}
        virtualItems={virtualItems}
        totalHeight={totalHeight}
        measureElement={measureElement}
      />
    );
  }
  return <StaticList verses={verses} />;
};

const VirtualizedList = ({
  verses,
  virtualItems,
  totalHeight,
  measureElement,
}: {
  verses: VerseType[];
  virtualItems: VirtualItem[];
  totalHeight: number;
  measureElement: (element: Element | null) => void;
}): React.JSX.Element => (
  <div style={{ height: totalHeight, position: 'relative' }}>
    {virtualItems.map((item) => {
      const verse = verses[item.index];
      if (!verse) return null;

      return (
        <div
          key={item.key}
          data-index={item.index}
          ref={measureElement}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${item.start}px)`,
          }}
          className=""
        >
          <VerseComponent verse={verse} />
        </div>
      );
    })}
  </div>
);

const StaticList = ({ verses }: { verses: VerseType[] }): React.JSX.Element => (
  <>
    {verses.map((verse) => (
      <VerseComponent key={verse.id} verse={verse} />
    ))}
  </>
);

const LoadingState = (): React.JSX.Element => (
  <div className="flex justify-center py-20">
    <Spinner className="h-8 w-8 text-accent" />
  </div>
);

const ErrorState = ({ message }: { message: string }): React.JSX.Element => (
  <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
    {message}
  </div>
);

const EmptyState = ({ label }: { label: string }): React.JSX.Element => (
  <div className="text-center py-20 text-muted">{label}</div>
);
