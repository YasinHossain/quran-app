'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';

import { BookmarksSidebar } from '../BookmarksSidebar';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Folder } from '@/types/bookmark';
import type { ReactNode } from 'react';

interface BookmarksLayoutProps {
  children: ReactNode;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  folders?: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

interface DesktopSidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  folders: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

const DesktopSidebar = ({
  activeSection,
  onSectionChange,
  folders,
  onVerseClick,
}: DesktopSidebarProps): React.JSX.Element => (
  <aside className="w-full sm:w-80 lg:w-80 bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full hidden lg:block">
    <BookmarksSidebar
      activeSection={activeSection}
      onSectionChange={onSectionChange}
      folders={folders}
      {...(onVerseClick && { onVerseClick })}
    />
  </aside>
);

interface MainContentProps {
  children: ReactNode;
  isHeaderHidden: boolean;
}

const MainContent = ({ children, isHeaderHidden }: MainContentProps): React.JSX.Element => (
  <main className="flex-1 h-full overflow-hidden">
    <div
      className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-6 transition-all duration-300 ${
        isHeaderHidden
          ? 'pt-2 sm:pt-3 md:pt-4'
          : 'pt-[calc(3.5rem+0.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+0.75rem+env(safe-area-inset-top))] md:pt-[calc(4rem+1rem+env(safe-area-inset-top))]'
      }`}
    >
      {children}
    </div>
  </main>
);

interface MobileSidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  folders: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

const MobileSidebarOverlay = ({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  folders,
  onVerseClick,
}: MobileSidebarOverlayProps): React.JSX.Element => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
              onClose();
            }}
          />
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

export const BookmarksLayout = ({
  children,
  activeSection,
  onSectionChange,
  folders = [],
  onVerseClick,
}: BookmarksLayoutProps): React.JSX.Element => {
  const { isHidden } = useHeaderVisibility();
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        <DesktopSidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          folders={folders}
          onVerseClick={onVerseClick}
        />
        <MainContent isHeaderHidden={isHidden}>{children}</MainContent>
      </div>
      <MobileSidebarOverlay
        isOpen={isBookmarkSidebarOpen}
        onClose={() => setBookmarkSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        folders={folders}
        onVerseClick={onVerseClick}
      />
    </>
  );
};
