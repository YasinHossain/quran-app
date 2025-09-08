'use client';

import { useArabicFontPanel } from '@/app/(features)/surah/components/panels/arabic-font-panel/useArabicFontPanel';
import { AlertIcon } from '@/app/shared/icons';

import { ArabicFontList } from './ArabicFontList';
import { FilterToggle } from './FilterToggle';

function LoadingState(): React.JSX.Element {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muted" />
    </div>
  );
}

function ErrorState({ error }: { error: string }): React.JSX.Element {
  return (
    <div className="mx-4 mt-4 p-4 rounded-lg border bg-error/10 border-error/20 text-error">
      <div className="flex items-center space-x-2">
        <AlertIcon className="h-5 w-5 text-status-error" />
        <span className="text-sm">{error}</span>
      </div>
    </div>
  );
}

function FontContent({
  activeFilter,
  setActiveFilter,
  resourcesToRender,
  selectedIds,
  handleSelectionToggle,
  listContainerRef,
  listHeight,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  resourcesToRender: unknown[];
  selectedIds: Set<string>;
  handleSelectionToggle: (id: string) => void;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
  listHeight: number;
}): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto" ref={listContainerRef}>
        <div className="px-4 py-4">
          <FilterToggle
            activeFilter={activeFilter as 'Uthmani' | 'IndoPak'}
            setActiveFilter={setActiveFilter as (f: 'Uthmani' | 'IndoPak') => void}
          />
        </div>
        <ArabicFontList
          resources={resourcesToRender}
          selectedIds={selectedIds}
          onToggle={handleSelectionToggle}
          height={listHeight}
        />
      </div>
    </div>
  );
}

interface ArabicFontContentProps {
  panel: ReturnType<typeof useArabicFontPanel>;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
  listHeight: number;
}

export function ArabicFontContent({
  panel,
  listContainerRef,
  listHeight,
}: ArabicFontContentProps): React.JSX.Element {
  const {
    loading,
    error,
    groupedFonts,
    activeFilter,
    setActiveFilter,
    selectedIds,
    handleSelectionToggle,
  } = panel;
  const resourcesToRender = groupedFonts[activeFilter] || [];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <FontContent
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      resourcesToRender={resourcesToRender}
      selectedIds={selectedIds}
      handleSelectionToggle={handleSelectionToggle}
      listContainerRef={listContainerRef}
      listHeight={listHeight}
    />
  );
}
