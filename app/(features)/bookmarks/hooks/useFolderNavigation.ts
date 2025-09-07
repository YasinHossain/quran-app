import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useFolderNavigation = (currentFolderId: string) => {
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
