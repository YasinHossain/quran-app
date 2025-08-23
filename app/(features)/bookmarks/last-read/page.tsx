'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { useRouter } from 'next/navigation';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { getChapters } from '@/lib/api/chapters';
import type { Chapter } from '@/types';

export default function LastReadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { lastRead } = useBookmarks();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch(() => {});
  }, []);

  const handleSectionChange = (section: string) => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'pinned') {
      router.push('/bookmarks/pinned');
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
            className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
              isHidden
                ? 'pt-0'
                : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]'
            }`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Last Read</h1>
                <p className="text-muted">Continue your Quran reading journey</p>
              </div>

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
                <div className="space-y-4">
                  {Object.entries(lastRead).map(([surahId, verseId]) => {
                    const chapter = chapters.find((c) => c.id === Number(surahId));
                    const total = chapter?.verses_count || 0;
                    const percent = total ? Math.round((verseId / total) * 100) : 0;
                    const handleNavigate = () => {
                      router.push(`/surah/${surahId}#verse-${verseId}`);
                    };
                    return (
                      <div
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
                        className="rounded-xl bg-surface border border-border p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">
                            {chapter?.name_simple || `Surah ${surahId}`}
                          </h3>
                          <span className="text-sm text-muted">{percent}%</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2 mb-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted">
                          Verse {verseId} of {total}
                        </p>
                      </div>
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
