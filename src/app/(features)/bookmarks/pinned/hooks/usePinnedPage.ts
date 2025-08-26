import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/presentation/providers/BookmarkContext';
import type { SectionId } from '@/presentation/shared/ui/cards/BookmarkNavigationCard';

export const usePinnedPage = () => {
  const router = useRouter();
  const { pinnedVerses } = useBookmarks();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSectionChange = (section: SectionId) => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else if (section === 'memorization') {
      router.push('/bookmarks/memorization');
    } else {
      router.push('/bookmarks/pinned');
    }
  };

  return {
    pinnedVerses,
    handleSectionChange,
  };
};
