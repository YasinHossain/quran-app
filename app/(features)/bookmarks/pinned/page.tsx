'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { PinIcon } from '@/app/shared/icons';
import { useRouter } from 'next/navigation';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { BookmarkCard } from '../components/BookmarkCard';

export default function PinnedAyahPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { pinnedVerses } = useBookmarks();

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSectionChange = (section: string) => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else {
      router.push('/bookmarks/pinned');
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        {/* Left Sidebar */}
        <aside className="w-80 h-full bg-surface border-r border-border hidden lg:block">
          <BookmarksSidebar activeSection="pinned" onSectionChange={handleSectionChange} />
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
            {/* Pinned Verses Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                  <PinIcon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground">Pinned Verses</h1>
                  <p className="text-xs text-muted">Quick access</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto"
            >
              {pinnedVerses.length === 0 ? (
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
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Pinned Verses</h3>
                  <p className="text-muted max-w-md mx-auto">
                    Pin your favorite verses while reading to access them quickly from here.
                  </p>
                </div>
              ) : (
                <div>
                  {pinnedVerses.map((bookmark) => (
                    <BookmarkCard key={bookmark.verseId} bookmark={bookmark} folderId="pinned" />
                  ))}
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
              <BookmarksSidebar activeSection="pinned" onSectionChange={handleSectionChange} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
