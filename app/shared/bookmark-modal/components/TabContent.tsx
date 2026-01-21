'use client';

import { BookmarkTab } from './BookmarkTab';
import { PinTab } from './PinTab';

import type { JSX } from 'react';

interface TabContentProps {
  activeTab: 'pin' | 'bookmark';
  verseId: string;
  verseKey: string;
  isCreatingFolder: boolean;
  newFolderName: string;
  onToggleCreateFolder: (creating: boolean) => void;
  onNewFolderNameChange: (name: string) => void;
  onClose?: () => void;
}

export function TabContent({
  activeTab,
  verseId,
  verseKey,
  isCreatingFolder,
  newFolderName,
  onToggleCreateFolder,
  onNewFolderNameChange,
  onClose,
}: TabContentProps): JSX.Element {
  return (
    <>
      {activeTab === 'pin' ? (
        <div className="flex-1 overflow-hidden min-h-0 animate-fade-in">
          <PinTab verseId={verseId} verseKey={verseKey} onClose={onClose} />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 animate-fade-in">
          <BookmarkTab
            verseId={verseId}
            verseKey={verseKey}
            isCreatingFolder={isCreatingFolder}
            newFolderName={newFolderName}
            onToggleCreateFolder={onToggleCreateFolder}
            onNewFolderNameChange={onNewFolderNameChange}
          />
        </div>
      )}
    </>
  );
}
