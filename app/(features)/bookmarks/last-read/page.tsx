'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { CircularProgress } from '../components/CircularProgress';
import { ClockIcon } from '@/app/shared/icons';
import { useRouter } from 'next/navigation';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';

export default function LastReadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { lastRead, chapters } = useBookmarks();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSectionChange = (section: string) => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'memorization') {
      router.push('/bookmarks/memorization');
    } else {
      router.push('/bookmarks/last-read');
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        {/* Left Sidebar */}
        <aside className="w-80 h-full bg-surface border-r border-border hidden lg:block">
          <BookmarksSidebar activeSection="last-read" onSectionChange={handleSectionChange} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-hidden">
          <div
            className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-6 transition-all duration-300 ${
              isHidden
                ? 'pt-4 sm:pt-6 md:pt-8'
                : 'pt-[calc(3.5rem+1rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] md:pt-[calc(4rem+2rem+env(safe-area-inset-top))]'
            }`}
          >
            {/* Last Read Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                  <ClockIcon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground">Recent</h1>
                  <p className="text-xs text-muted">Last visited</p>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="">
              {Object.keys(lastRead).length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Activity</h3>
                  <p className="text-muted max-w-md mx-auto">
                    Start reading the Quran and your progress will be automatically tracked here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {Object.entries(lastRead)
                    .filter(([surahId, verseId]) => {
                      const chapter = chapters.find((c) => c.id === Number(surahId));
                      const total = chapter?.verses_count || 0;
                      // Filter out invalid entries where verseId > total verses
                      return total > 0 && verseId <= total && verseId > 0;
                    })
                    .map(([surahId, verseId]) => {
                      const chapter = chapters.find((c) => c.id === Number(surahId));
                      const total = chapter?.verses_count || 0;
                      const percent = Math.min(
                        100,
                        Math.max(0, Math.round((verseId / total) * 100))
                      );
                      const handleNavigate = () => {
                        router.push(`/surah/${surahId}#verse-${verseId}`);
                      };
                      return (
                        <motion.div
                          key={surahId}
                          role="button"
                          tabIndex={0}
                          aria-label={`Continue reading ${chapter?.name_simple || `Surah ${surahId}`} at verse ${verseId}`}
                          onClick={handleNavigate}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleNavigate();
                            }
                          }}
                          className="w-[calc(50%-0.5rem)] sm:w-72 lg:w-80 h-80 bg-surface rounded-2xl shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-xl transition-all duration-300 border border-border/50 p-6 text-center flex flex-col items-center justify-between"
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: parseInt(surahId) * 0.1 }}
                        >
                          <div className="flex-1 flex items-center justify-center">
                            <CircularProgress
                              percentage={percent}
                              label="Complete"
                              size={160}
                              strokeWidth={15}
                            />
                          </div>
                          <div className="mt-4">
                            <p className="text-lg font-bold text-foreground truncate">
                              {chapter?.name_simple || `Surah ${surahId}`}
                            </p>
                            <p className="text-sm text-muted mt-1">
                              Verse {verseId} of {total}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-surface-overlay/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-surface border-r border-border z-50 lg:hidden"
            >
              <BookmarksSidebar activeSection="last-read" onSectionChange={handleSectionChange} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
