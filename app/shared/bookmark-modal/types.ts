import { Folder, Bookmark } from '@/types';

export interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseId: string;
  verseKey?: string;
}

export interface BookmarkTabProps {
  folders: Folder[];
  verseId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCreatingFolder: boolean;
  newFolderName: string;
  onFolderSelect: (folder: Folder) => void;
  onCreateFolder: () => void;
  onToggleCreateFolder: (creating: boolean) => void;
  onNewFolderNameChange: (name: string) => void;
  findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
}

export interface PinTabProps {
  verseId: string;
  verseKey: string;
  isVersePinned: boolean;
  onTogglePin: () => void;
}
