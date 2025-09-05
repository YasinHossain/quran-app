'use client';
import { IconSearch, IconX, IconClock, IconTrendingUp } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import type React from 'react';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearch = ({ isOpen, onClose }: QuickSearchProps): JSX.Element => {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState([
    'Al-Fatiha',
    'Ayatul Kursi',
    'Surah Rahman',
    'Last 10 Surahs',
  ]);
  const [trendingSearches] = useState([
    'Surah Yaseen',
    'Surah Mulk',
    'Surah Kahf',
    'Dua collection',
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input after animation completes
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 mx-auto max-w-2xl z-50"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center p-4 border-b border-border/30">
                <IconSearch size={20} className="text-muted mr-3 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search verses, surahs, topics..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted text-lg"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors ml-2"
                >
                  <IconX size={20} className="text-muted" />
                </button>
              </div>

              {/* Search Content */}
              <div className="max-h-96 overflow-y-auto">
                {query.length === 0 ? (
                  <div className="p-4 space-y-6">
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <IconClock size={16} className="text-muted" />
                        <h3 className="text-sm font-medium text-muted uppercase tracking-wide">
                          Recent
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="w-full text-left p-3 hover:bg-muted/50 rounded-xl transition-colors group"
                          >
                            <span className="text-foreground group-hover:text-primary transition-colors">
                              {search}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trending Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <IconTrendingUp size={16} className="text-muted" />
                        <h3 className="text-sm font-medium text-muted uppercase tracking-wide">
                          Trending
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="w-full text-left p-3 hover:bg-muted/50 rounded-xl transition-colors group"
                          >
                            <span className="text-foreground group-hover:text-primary transition-colors">
                              {search}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-center text-muted py-8">
                      Press Enter to search for &quot;{query}&quot;
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
