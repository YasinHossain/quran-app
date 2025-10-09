'use client';

import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';
import { useSidebar } from '@/app/providers/SidebarContext';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';

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
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  return (
    <>
      <ThreeColumnWorkspace
        left={<BookmarksSidebar activeSection={activeSection} onSectionChange={onSectionChange} />}
        center={
          <WorkspaceMain
            data-slot="bookmarks-landing-main"
            contentClassName="gap-4 pb-12 sm:gap-6"
            className="bg-background"
          >
            <div className="flex flex-1 flex-col">{children}</div>
          </WorkspaceMain>
        }
      />
      <BookmarksMobileSidebarOverlay
        isOpen={isBookmarkSidebarOpen}
        onClose={() => setBookmarkSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
    </>
  );
};
