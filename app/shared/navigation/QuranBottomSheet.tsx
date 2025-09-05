'use client';

import { IconX, IconBook, IconHash, IconFileText } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import juzData from '@/data/juz.json';
import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { SearchInput } from '../components/SearchInput';

import type { Surah } from '@/types';

interface NavigationItemProps {
  number: number;
  title: string;
  subtitle?: string;
  arabicName?: string;
  onClick: () => void;
}

const NavigationItem = memo(function NavigationItem({
  number,
  title,
  subtitle,
  arabicName,
  onClick,
}: NavigationItemProps): React.JSX.Element {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-interactive transition-all duration-200 text-left group touch-manipulation"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center font-semibold text-sm group-hover:bg-accent group-hover:text-on-accent transition-colors">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
            {title}
          </h3>
          {arabicName && <span className="text-xl text-accent/70 font-arabic">{arabicName}</span>}
        </div>
        {subtitle && (
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
});

interface TabContentProps {
  activeTab: 'surah' | 'juz' | 'page';
  filteredSurahs: Surah[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  onSurahClick: (surahId: number) => void;
  onJuzClick: (juzNumber: number) => void;
  onPageClick: (page: number) => void;
}

const TabContent = memo(function TabContent({
  activeTab,
  filteredSurahs,
  filteredJuzs,
  filteredPages,
  onSurahClick,
  onJuzClick,
  onPageClick,
}: TabContentProps): React.JSX.Element {
  if (activeTab === 'surah') {
    return (
      <div className="p-4">
        <div className="grid gap-2">
          {filteredSurahs.map((surah) => (
            <NavigationItem
              key={surah.number}
              number={surah.number}
              title={surah.name}
              subtitle={`${surah.verses} verses`}
              arabicName={surah.arabicName}
              onClick={() => onSurahClick(surah.number)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'juz') {
    return (
      <div className="p-4">
        <div className="grid gap-2">
          {filteredJuzs.map((juz) => (
            <NavigationItem
              key={juz.number}
              number={juz.number}
              title={`Juz ${juz.number}`}
              subtitle={juz.surahRange}
              onClick={() => onJuzClick(juz.number)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid gap-2">
        {filteredPages.map((page) => (
          <NavigationItem
            key={page}
            number={page}
            title={`Page ${page}`}
            onClick={() => onPageClick(page)}
          />
        ))}
      </div>
    </div>
  );
});

interface QuranBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect: (surahId: number) => void;
}

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

export const QuranBottomSheet = memo(function QuranBottomSheet({
  isOpen,
  onClose,
  onSurahSelect,
}: QuranBottomSheetProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const [surahs, setSurahs] = useState<Surah[]>([]);

  const router = useRouter();

  useEffect(() => {
    getSurahList()
      .then(setSurahs)
      .catch((err) => logger.error(err as Error));
  }, []);

  const juzs = useMemo(() => juzData as JuzSummary[], []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);

  const tabs = [
    { id: 'surah', label: 'Surah', icon: IconBook },
    { id: 'juz', label: 'Juz', icon: IconHash },
    { id: 'page', label: 'Page', icon: IconFileText },
  ];

  const term = searchTerm.toLowerCase();
  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        (s) => s.name.toLowerCase().includes(term) || s.number.toString().includes(searchTerm)
      ),
    [surahs, term, searchTerm]
  );
  const filteredJuzs = useMemo(
    () =>
      juzs.filter(
        (j) => j.name.toLowerCase().includes(term) || j.number.toString().includes(searchTerm)
      ),
    [juzs, term, searchTerm]
  );
  const filteredPages = useMemo(
    () => pages.filter((p) => p.toString().includes(searchTerm)),
    [pages, searchTerm]
  );

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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: '100%',
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-50 touch-none"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
            }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-h-[90dvh] flex flex-col pb-safe touch-pan-y"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Select Quran</h2>
              <button
                onClick={onClose}
                className="btn-touch p-2 rounded-full hover:bg-interactive transition-colors"
              >
                <IconX size={20} className="text-muted" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-border">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search surahs, juz, or page..."
                variant="panel"
                size="md"
              />
            </div>

            {/* Tabs */}
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

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
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
