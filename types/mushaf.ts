export interface MushafOption {
  id: string;
  name: string;
  description?: string;
  script?: 'uthmani' | 'indopak' | 'tajweed' | string;
  lines?: number;
}

export type MushafCharType = 'word' | 'end' | 'pause' | 'sajdah' | 'rub' | 'symbol' | string;

export interface MushafWord {
  id?: number | undefined;
  verseKey?: string | undefined;
  pageNumber?: number | undefined;
  lineNumber?: number | undefined;
  position: number;
  charType?: MushafCharType | undefined;
  location?: string | undefined;
  textUthmani?: string | undefined;
  textIndopak?: string | undefined;
  codeV1?: string | undefined;
  codeV2?: string | undefined;
}

export interface MushafVerse {
  id: number;
  verseKey: string;
  chapterId?: number | string | undefined;
  pageNumber: number;
  juzNumber?: number | undefined;
  hizbNumber?: number | undefined;
  rubElHizbNumber?: number | undefined;
  textUthmani?: string | undefined;
  textIndopak?: string | undefined;
  textUthmaniTajweed?: string | undefined;
  words: MushafWord[];
}

export interface MushafLineGroup {
  lineNumber: number;
  key: string;
  words: MushafWord[];
}

export interface MushafPageLines {
  pageNumber: number;
  lines: MushafLineGroup[];
}
