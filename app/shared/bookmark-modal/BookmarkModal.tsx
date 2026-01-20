'use client';

import { memo } from 'react';

import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';

import { TabContent } from './components/TabContent';
import { TabNavigation } from './components/TabNavigation';
import { BookmarkModalProps } from './types';
import { useBookmarkModal } from './useBookmarkModal';

export const BookmarkModal = memo(function BookmarkModal({
  isOpen,
  onClose,
  verseId,
  verseKey = '',
}: BookmarkModalProps): React.JSX.Element {
  const {
    activeTab,
    setActiveTab,
    isCreatingFolder,
    openCreateFolder,
    closeCreateFolder,
    newFolderName,
    setNewFolderName,
  } = useBookmarkModal();

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Bookmark options"
      backdropClassName="touch-none"
      contentClassName="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col"
    >
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        verseKey={verseKey}
        onClose={onClose}
      />
      <TabContent
        activeTab={activeTab}
        verseId={verseId}
        verseKey={verseKey}
        isCreatingFolder={isCreatingFolder}
        newFolderName={newFolderName}
        onToggleCreateFolder={(creating) => (creating ? openCreateFolder() : closeCreateFolder())}
        onNewFolderNameChange={setNewFolderName}
        onClose={onClose}
      />
    </UnifiedModal>
  );
});
