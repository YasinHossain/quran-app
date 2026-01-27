import { usePathname, useRouter } from 'next/navigation';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useModal } from '@/app/shared/hooks/useModal';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Chapter } from '@/types';

interface UsePlannerPageResult {
  planner: ReturnType<typeof useBookmarks>['planner'];
  chapters: Chapter[];
  modal: ReturnType<typeof useModal>;
  handleSectionChange: (section: SectionId) => void;
}

export const usePlannerPage = (): UsePlannerPageResult => {
  const router = useRouter();
  const pathname = usePathname();
  const { planner, chapters } = useBookmarks();
  const modal = useModal();

  const handleSectionChange = (section: SectionId): void => {
    const locale = getLocaleFromPathname(pathname) ?? 'en';
    if (section === 'bookmarks') {
      router.push(localizeHref('/bookmarks/folders', locale));
    } else if (section === 'pinned') {
      router.push(localizeHref('/bookmarks/pinned', locale));
    } else if (section === 'last-read') {
      router.push(localizeHref('/bookmarks/last-read', locale));
    } else {
      router.push(localizeHref('/bookmarks/planner', locale));
    }
  };

  return {
    planner,
    chapters,
    modal,
    handleSectionChange,
  };
};
