export const LocalStorage = {
  getBookmarks: () => [],
  addBookmark: (_verseKey: string, _folderId?: string) => true,
  removeBookmark: (_verseKey: string, _folderId?: string) => true,
  createFolder: (_name: string) => 'folder-id',
  deleteFolder: (_folderId: string) => true,
  renameFolder: (_folderId: string, _newName: string) => true,
  isBookmarked: (_verseKey: string) => false,
  getSettings: () => ({}),
  saveSettings: (_settings: any) => true,
};
