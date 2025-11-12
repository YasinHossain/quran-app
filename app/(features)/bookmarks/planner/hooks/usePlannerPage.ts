import { useRouter } from 'next/navigation';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useBodyScrollLock } from '@/app/providers/hooks/useBodyScrollLock';
import { useModal } from '@/app/shared/hooks/useModal';

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
  const { planner, chapters } = useBookmarks();
  const modal = useModal();

  useBodyScrollLock(true);

  const handleSectionChange = (section: SectionId): void => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else {
      router.push('/bookmarks/planner');
    }
  };

  return {
    planner,
    chapters,
    modal,
    handleSectionChange,
  };
};
