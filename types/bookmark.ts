export interface Bookmark {
  verseId: string;
  createdAt: number; // Store as timestamp
}

export interface Folder {
  id: string; // Store as timestamp string or UUID
  name: string;
  bookmarks: Bookmark[];
  createdAt: number;
}
