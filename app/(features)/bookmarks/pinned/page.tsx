'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import { usePinnedPage } from './hooks/usePinnedPage';
import { PinnedHeader, PinnedVersesList } from './components';

export default function PinnedAyahPage() {
  const { isHidden } = useHeaderVisibility();
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();
  const { pinnedVerses, handleSectionChange } = usePinnedPage();

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
            <PinnedHeader />

            <PinnedVersesList pinnedVerses={pinnedVerses} />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isBookmarkSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookmarkSidebarOpen(false)}
              className="fixed inset-0 bg-surface-overlay/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-surface border-r border-border z-50 lg:hidden"
            >
              <BookmarksSidebar activeSection="pinned" onSectionChange={handleSectionChange} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
