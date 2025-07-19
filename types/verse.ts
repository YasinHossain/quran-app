export interface Translation {
  id?: number;
  resource_id: number;
  text: string;
}

export interface Audio {
  url: string;
}

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  audio?: Audio;
  translations?: Translation[];
}
