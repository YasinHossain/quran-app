import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useBodyScrollLock } from '@/app/providers/hooks/useBodyScrollLock';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

export interface UseBookmarksPageReturn {
  folders: ReturnType<typeof useBookmarks>['folders'];
  sortedFolders: ReturnType<typeof useBookmarks>['folders'];
  handleFolderSelect: (folderId: string) => void;
  handleSectionChange: (section: SectionId) => void;
}

type SortKey = 'recent' | 'name-asc' | 'name-desc' | 'most-verses';

function sortFolders<F extends { name: string; bookmarks: unknown[]; createdAt?: number }>(
  folders: F[],
  sortBy: SortKey
): F[] {
  const items = [...folders];
  switch (sortBy) {
    case 'name-asc':
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return items.sort((a, b) => b.name.localeCompare(a.name));
    case 'most-verses':
      return items.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
    case 'recent':
    default:
      return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
}

function sectionToPath(section: SectionId): string {
  switch (section) {
    case 'pinned':
      return '/bookmarks/pinned';
    case 'last-read':
      return '/bookmarks/last-read';
    case 'memorization':
      return '/bookmarks/memorization';
    default:
      return '/bookmarks';
  }
}

export const useBookmarksPage = (): UseBookmarksPageReturn => {
  const { folders } = useBookmarks();
  const [sortBy] = useState<SortKey>('recent');
  const router = useRouter();

  useBodyScrollLock(true);

  const sortedFolders = useMemo(() => sortFolders(folders, sortBy), [folders, sortBy]);

  const handleFolderSelect = (folderId: string): void => {
    router.push(`/bookmarks/${folderId}`);
  };

  const handleSectionChange = (section: SectionId): void => {
    router.push(sectionToPath(section));
  };

  return { folders, sortedFolders, handleFolderSelect, handleSectionChange };
};
