'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

import { QuranBottomSheetHeader } from './components/QuranBottomSheetHeader';
import { QuranTabBar } from './components/QuranTabBar';
import { TabContent } from './components/TabContent';
import { useBottomSheetHandlers } from './hooks/useBottomSheetHandlers';
import { useQuranNavigation } from './hooks/useQuranNavigation';

interface QuranBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect: (surahId: number) => void;
}

export const QuranBottomSheet = memo(function QuranBottomSheet({
  isOpen,
  onClose,
  onSurahSelect,
}: QuranBottomSheetProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={onClose} />
          <Sheet>
            <BottomSheetContent
              onClose={onClose}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredSurahs={filteredSurahs}
              filteredJuzs={filteredJuzs}
              filteredPages={filteredPages}
              handleSurahClick={handleSurahClick}
              handleJuzClick={handleJuzClick}
              handlePageClick={handlePageClick}
            />
          </Sheet>
        </>
      )}
    </AnimatePresence>
  );
});

const BottomSheetContent = memo(function BottomSheetContent({
  onClose,
  searchTerm,
  setSearchTerm,
  tabs,
  activeTab,
  setActiveTab,
  filteredSurahs,
  filteredJuzs,
  filteredPages,
  handleSurahClick,
  handleJuzClick,
  handlePageClick,
}: {
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredSurahs: unknown[];
  filteredJuzs: unknown[];
  filteredPages: unknown[];
  handleSurahClick: (id: number) => void;
  handleJuzClick: (id: number) => void;
  handlePageClick: (id: number) => void;
}): React.ReactElement {
  return (
    <>
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
    </>
  );
});

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
};

const Backdrop = ({ onClose }: { onClose: () => void }): React.ReactElement => (
  <motion.div
    variants={backdropVariants}
    initial="hidden"
    animate="visible"
    exit="hidden"
    className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-50 touch-none"
    onClick={onClose}
  />
);

const Sheet = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <motion.div
    variants={sheetVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
    className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-h-[90dvh] flex flex-col pb-safe touch-pan-y"
  >
    {children}
  </motion.div>
);
