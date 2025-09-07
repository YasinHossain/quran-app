export interface ParsedVerseKey {
  surahNumber: number;
  ayahNumber: number;
}

export const parseVerseKey = (verseKey?: string): ParsedVerseKey => {
  if (!verseKey) return { surahNumber: 0, ayahNumber: 0 };
  const [surah, ayah] = verseKey.split(':').map(Number);
  return { surahNumber: surah || 0, ayahNumber: ayah || 0 };
};
