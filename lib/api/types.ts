export interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  pages?: [number, number];
}

export interface TranslationResource {
  id: number;
  name: string;
  language_name: string;
}

export interface TafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
}

export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}
