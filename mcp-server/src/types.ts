// MCP Server types for Quran App
export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations?: Translation[];
  words?: Word[];
  audio?: {
    url: string;
  };
}

export interface Translation {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  text: string;
  resource_id: number;
}

export interface Word {
  id: number;
  uthmani: string;
  [lang: string]: string | number | undefined;
}

export interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  translated_name?: {
    name: string;
    language_name: string;
  };
  pages: number[];
  revelation_order: number;
  revelation_place: string;
}

export interface Surah {
  number: number;
  name: string;
  arabicName: string;
  verses: number;
  meaning: string;
}

export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}

export interface JuzMetadata {
  number: number;
  name: string;
  surahRange: string;
}

export interface TafsirResource {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
}

export interface TafsirText {
  id: number;
  text: string;
  verse_id: number;
  verse_key: string;
  resource_id: number;
  resource_name: string;
}

export interface Bookmark {
  verseId: string;
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  bookmarks: Bookmark[];
  createdAt: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: number;
  arabicFont: string;
  translations: number[];
  tafsirs: number[];
  audioReciter: number;
  autoplay: boolean;
  repeatMode: 'off' | 'verse' | 'surah';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  perPage: number;
  total: number;
}
