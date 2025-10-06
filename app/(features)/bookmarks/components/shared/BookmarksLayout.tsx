'use client';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';

import { BookmarksDesktopSidebar } from './layout/BookmarksDesktopSidebar';
import { BookmarksMainContent } from './layout/BookmarksMainContent';
import { BookmarksMobileSidebarOverlay } from './layout/BookmarksMobileSidebarOverlay';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { ReactNode } from 'react';

interface BookmarksLayoutProps {
  children: ReactNode;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}

export const BookmarksLayout = ({
  children,
  activeSection,
  onSectionChange,
}: BookmarksLayoutProps): React.JSX.Element => {
  const { isHidden } = useHeaderVisibility();
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        <BookmarksDesktopSidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <BookmarksMainContent isHeaderHidden={isHidden}>{children}</BookmarksMainContent>
      </div>
      <BookmarksMobileSidebarOverlay
        isOpen={isBookmarkSidebarOpen}
        onClose={() => setBookmarkSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
    </>
  );
};
