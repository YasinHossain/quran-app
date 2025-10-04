'use client';

import { useWindowVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';
import { buildPageRoute } from '@/app/shared/navigation/routes';
import { PageNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

const GAP_PX = 24;
const ROW_HEIGHT = 168;

function calculateColumns(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

function useColumnCount(containerRef: React.RefObject<HTMLDivElement | null>): number {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const nextColumns = calculateColumns(entry.contentRect.width);
      setColumns((prev) => (prev === nextColumns ? prev : nextColumns));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  return columns;
}

function useScrollMargin(containerRef: React.RefObject<HTMLDivElement | null>, columns: number): number {
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMargin = (): void => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setScrollMargin(window.scrollY + rect.top);
    };

    updateMargin();
    window.addEventListener('resize', updateMargin);
    return () => window.removeEventListener('resize', updateMargin);
  }, [containerRef, columns]);

  return scrollMargin;
}

function usePageRows(pages: readonly number[], columns: number): number[][] {
  return useMemo(() => {
    if (!pages.length) return [];

    const groupSize = Math.max(columns, 1);
    const grouped: number[][] = [];
    for (let index = 0; index < pages.length; index += groupSize) {
      grouped.push(pages.slice(index, index + groupSize));
    }
    return grouped;
  }, [pages, columns]);
}

function usePageVirtualizer(rows: number[][], scrollMargin: number): Virtualizer<Window, Element> {
  const estimateRowSize = useCallback(() => ROW_HEIGHT, []);

  return useWindowVirtualizer({
    count: rows.length,
    estimateSize: estimateRowSize,
    overscan: 6,
    scrollMargin,
  });
}

export const PageTab = memo(function PageTab(): React.JSX.Element {
  const { pages } = useNavigationDatasets();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const columns = useColumnCount(containerRef);
  const scrollMargin = useScrollMargin(containerRef, columns);
  const rows = usePageRows(pages, columns);
  const virtualizer = usePageVirtualizer(rows, scrollMargin);

  return (
    <div ref={containerRef} className="relative">
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index] ?? [];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                boxSizing: 'border-box',
                paddingBottom: virtualRow.index === rows.length - 1 ? 0 : GAP_PX,
              }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {row.map((page) => (
                  <PageNavigationCard
                    key={page}
                    href={buildPageRoute(page)}
                    scroll
                    className="items-center"
                    content={{
                      id: page,
                      title: `Page ${page}`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
