'use client';

import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksDesktopSidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}

export const BookmarksDesktopSidebar = ({
  activeSection,
  onSectionChange,
}: BookmarksDesktopSidebarProps): React.JSX.Element => (
  <aside className="w-full sm:w-80 lg:w-80 bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full hidden lg:block">
    <BookmarksSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
  </aside>
);
