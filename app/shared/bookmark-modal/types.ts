export interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseId: string;
  verseKey?: string;
}

export interface BookmarkTabProps {
  verseId: string;
  verseKey?: string;
  isCreatingFolder: boolean;
  newFolderName: string;
  onToggleCreateFolder: (creating: boolean) => void;
  onNewFolderNameChange: (name: string) => void;
}

export interface PinTabProps {
  verseId: string;
  verseKey?: string;
}
