'use client';

import { IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback } from 'react';

import { SearchInput } from '../components/SearchInput';
import { TabContent } from './components/TabContent';
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
  const router = useRouter();

  const handleSurahClick = useCallback(
    (surahId: number) => {
      onSurahSelect(surahId);
      onClose();
    },
    [onSurahSelect, onClose]
  );
  const handleJuzClick = useCallback(
    (juzNumber: number) => {
      router.push(`/juz/${juzNumber}`);
      onClose();
    },
    [router, onClose]
  );
  const handlePageClick = useCallback(
    (page: number) => {
      router.push(`/page/${page}`);
      onClose();
    },
    [router, onClose]
  );

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const sheetVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-50 touch-none"
            onClick={onClose}
          />
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-h-[90dvh] flex flex-col pb-safe touch-pan-y"
          >
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Select Quran</h2>
              <button
                onClick={onClose}
                className="btn-touch p-2 rounded-full hover:bg-interactive transition-colors"
              >
                <IconX size={20} className="text-muted" />
              </button>
            </div>
            <div className="px-6 py-4 border-b border-border">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search surahs, juz, or page..."
                variant="panel"
                size="md"
              />
            </div>
            <div className="flex border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'surah' | 'juz' | 'page')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all duration-200 relative ${
                      isActive ? 'text-accent' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} className="stroke-[2]" />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
