'use client';

import { memo, useEffect, useState } from 'react';

import { QuranBottomSheetHeader } from './components/QuranBottomSheetHeader';
import { QuranTabBar } from './components/QuranTabBar';
import { TabContent } from './components/TabContent';
import { useBottomSheetHandlers } from './hooks/useBottomSheetHandlers';
import { useQuranNavigation } from './hooks/useQuranNavigation';

// Duration for exit animation (matches CSS)
const EXIT_ANIMATION_MS = 150;

interface QuranBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect: (surahId: number) => void;
}

export const QuranBottomSheet = memo(function QuranBottomSheet({
  isOpen,
  onClose,
  onSurahSelect,
}: QuranBottomSheetProps): React.JSX.Element | null {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    tabs,
    filteredSurahs,
    filteredJuzs,
    filteredPages,
  } = useQuranNavigation();
  const { handleSurahClick, handleJuzClick, handlePageClick } = useBottomSheetHandlers(
    onClose,
    onSurahSelect
  );

  // Handle open/close state changes
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsExiting(false);
      return undefined;
    }
    if (shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, EXIT_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      <Backdrop onClose={onClose} isExiting={isExiting} />
      <Sheet isExiting={isExiting}>
        <QuranBottomSheetHeader
          onClose={onClose}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <QuranTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto">
          <TabContent
            activeTab={activeTab}
            filteredSurahs={filteredSurahs}
            filteredJuzs={filteredJuzs}
            filteredPages={filteredPages}
            onSurahClick={handleSurahClick}
            onJuzClick={handleJuzClick}
            onPageClick={handlePageClick}
          />
        </div>
      </Sheet>
    </>
  );
});

const Backdrop = ({
  onClose,
  isExiting,
}: {
  onClose: () => void;
  isExiting: boolean;
}): React.ReactElement => (
  <button
    type="button"
    tabIndex={-1}
    aria-label="Close"
    className={`fixed inset-0 bg-surface-overlay/60 z-50 touch-none ${isExiting ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
    onClick={onClose}
  />
);

const Sheet = ({
  children,
  isExiting,
}: {
  children: React.ReactNode;
  isExiting: boolean;
}): React.ReactElement => (
  <div
    className={`fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-h-[90dvh] flex flex-col pb-safe touch-pan-y transform-gpu ${isExiting ? 'animate-sheet-out' : 'animate-sheet-in'}`}
    style={{ willChange: 'transform' }}
  >
    {children}
  </div>
);
