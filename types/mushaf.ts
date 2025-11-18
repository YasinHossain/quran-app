export interface MushafOption {
  id: string;
  name: string;
  description?: string;
  script?: 'uthmani' | 'indopak' | 'tajweed' | string;
  lines?: number;
}

export type MushafCharType =
  | 'word'
  | 'end'
  | 'pause'
  | 'sajdah'
  | 'rub'
  | 'symbol'
  | string;

export interface MushafWord {
  id?: number;
  verseKey?: string;
  pageNumber?: number;
  lineNumber?: number;
  position: number;
  charType?: MushafCharType;
  location?: string;
  textUthmani?: string;
  textIndopak?: string;
  codeV1?: string;
  codeV2?: string;
}

export interface MushafVerse {
  id: number;
  verseKey: string;
  chapterId?: number | string;
  pageNumber: number;
  juzNumber?: number;
  hizbNumber?: number;
  rubElHizbNumber?: number;
  textUthmani?: string;
  textIndopak?: string;
  textUthmaniTajweed?: string;
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
