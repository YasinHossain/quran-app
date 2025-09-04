'use client';
import type React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../BookmarksSidebar';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Folder } from '@/types/bookmark';

interface BookmarksLayoutProps {
  children: React.ReactNode;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  folders?: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

export const BookmarksLayout: React.FC<BookmarksLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  folders = [],
  onVerseClick,
}: BookmarksLayoutProps): JSX.Element => {
  const { isHidden } = useHeaderVisibility();
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        {/* Desktop Sidebar */}
        <aside className="w-full sm:w-80 lg:w-80 bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full hidden lg:block">
          <BookmarksSidebar
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            folders={folders}
            {...(onVerseClick && { onVerseClick })}
          />
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
            {children}
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
              className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-full sm:w-80 lg:w-80 bg-background text-foreground border-r border-border z-50 lg:hidden"
            >
              <BookmarksSidebar
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                folders={folders}
                onVerseClick={(verseKey) => {
                  onVerseClick?.(verseKey);
                  setBookmarkSidebarOpen(false);
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
