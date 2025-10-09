'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksMobileSidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}

export const BookmarksMobileSidebarOverlay = ({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
}: BookmarksMobileSidebarOverlayProps): React.JSX.Element => (
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
          className="fixed left-0 top-reader-header z-50 h-[calc(100vh-var(--reader-header-height))] w-full bg-background text-foreground border-r border-border lg:hidden sm:w-80 lg:w-reader-sidebar-left"
        >
          <BookmarksSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);
