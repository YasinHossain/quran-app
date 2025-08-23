export interface Bookmark {
  verseId: string;
  createdAt: number; // Store as timestamp
}

export interface Folder {
  id: string; // Store as timestamp string or UUID
  name: string;
  bookmarks: Bookmark[];
  createdAt: number;
  color?: string; // Folder color customization
  icon?: string; // Folder icon customization
}

// Enhanced bookmark with verse content for display
export interface BookmarkWithVerse extends Bookmark {
  verse?: {
    id: number;
    verse_key: string;
    text_uthmani: string;
    surahId: number;
    ayahNumber: number;
    surahNameEnglish: string;
    surahNameArabic: string;
    translations?: Array<{
      id: number;
      resource_id: number;
      text: string;
    }>;
  };
}
