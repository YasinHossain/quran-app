'use client';

import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Folder } from '@/types/bookmark';

interface BookmarksDesktopSidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  folders: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

export const BookmarksDesktopSidebar = ({
  activeSection,
  onSectionChange,
  folders,
  onVerseClick,
}: BookmarksDesktopSidebarProps): React.JSX.Element => (
  <aside className="w-full sm:w-80 lg:w-80 bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full hidden lg:block">
    <BookmarksSidebar
      activeSection={activeSection}
      onSectionChange={onSectionChange}
      folders={folders}
      {...(onVerseClick && { onVerseClick })}
    />
  </aside>
);

