import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/presentation/providers/BookmarkContext';
import { useModal } from '@/presentation/shared/hooks/useModal';
import type { SectionId } from '@/presentation/shared/ui/cards/BookmarkNavigationCard';

export const useMemorizationPage = () => {
  const router = useRouter();
  const { memorization, chapters } = useBookmarks();
  const modal = useModal();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSectionChange = (section: SectionId) => {
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
