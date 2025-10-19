import { useRouter } from 'next/navigation';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useBodyScrollLock } from '@/app/providers/hooks/useBodyScrollLock';
import { useModal } from '@/app/shared/hooks/useModal';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Chapter } from '@/types';

interface UseMemorizationPageResult {
  memorization: ReturnType<typeof useBookmarks>['memorization'];
  chapters: Chapter[];
  modal: ReturnType<typeof useModal>;
  handleSectionChange: (section: SectionId) => void;
}

export const useMemorizationPage = (): UseMemorizationPageResult => {
  const router = useRouter();
  const { memorization, chapters } = useBookmarks();
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
      router.push('/bookmarks/memorization');
    }
  };

  return {
    memorization,
    chapters,
    modal,
    handleSectionChange,
  };
};
