import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface UseFolderNavigationReturn {
  handleFolderSelect: (folderId: string) => void;
}

export const useFolderNavigation = (currentFolderId: string): UseFolderNavigationReturn => {
  const router = useRouter();

  const handleFolderSelect = useCallback(
    (folderId: string): void => {
      if (folderId !== currentFolderId) {
        router.push(`/bookmarks/${folderId}`);
      }
    },
    [currentFolderId, router]
  );

  return { handleFolderSelect };
};
