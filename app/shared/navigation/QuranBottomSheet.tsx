'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconBook, IconHash, IconFileText } from '@tabler/icons-react';
import { SearchInput } from '../components/SearchInput';

interface QuranBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect: (surahId: number) => void;
}

const QuranBottomSheet: React.FC<QuranBottomSheetProps> = ({ isOpen, onClose, onSurahSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');

  // Mock data - replace with actual data
  const surahs = Array.from({ length: 114 }, (_, i) => ({
    id: i + 1,
    name: `Surah ${i + 1}`,
    arabicName: 'السورة',
    verses: Math.floor(Math.random() * 200) + 1,
    revelation: i < 87 ? 'Meccan' : 'Medinan',
  }));

  const tabs = [
    { id: 'surah', label: 'Surah', icon: IconBook },
    { id: 'juz', label: 'Juz', icon: IconHash },
    { id: 'page', label: 'Page', icon: IconFileText },
  ];

  const handleSurahClick = (surahId: number) => {
    onSurahSelect(surahId);
    onClose();
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 touch-none"
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
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-h-[90dvh] flex flex-col touch-pan-y"
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
              {activeTab === 'surah' && (
                <div className="p-4">
                  <div className="grid gap-2">
                    {surahs
                      .filter(
                        (surah) =>
                          searchTerm === '' ||
                          surah.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((surah) => (
                        <motion.button
                          key={surah.id}
                          onClick={() => handleSurahClick(surah.id)}
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-interactive transition-all duration-200 text-left group touch-manipulation"
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Number badge */}
                          <div className="flex-shrink-0 w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center font-semibold text-sm group-hover:bg-accent group-hover:text-on-accent transition-colors">
                            {surah.id}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                                {surah.name}
                              </h3>
                              <span className="text-xl text-accent/70 font-arabic">
                                {surah.arabicName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted">
                              <span>{surah.verses} verses</span>
                              <span className="w-1 h-1 bg-current rounded-full" />
                              <span>{surah.revelation}</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                  </div>
                </div>
              )}

              {/* Juz and Page tabs content */}
              {activeTab === 'juz' && (
                <div className="p-4">
                  <div className="text-center text-muted py-8">Juz content coming soon</div>
                </div>
              )}

              {activeTab === 'page' && (
                <div className="p-4">
                  <div className="text-center text-muted py-8">Page content coming soon</div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuranBottomSheet;
