export const SAJDAH_VERSES = [
  { surah: 7, ayah: 206 },
  { surah: 13, ayah: 15 },
  { surah: 16, ayah: 50 },
  { surah: 17, ayah: 109 },
  { surah: 19, ayah: 58 },
  { surah: 22, ayah: 18 },
  { surah: 22, ayah: 77 },
  { surah: 25, ayah: 60 },
  { surah: 27, ayah: 26 },
  { surah: 32, ayah: 15 },
  { surah: 38, ayah: 24 },
  { surah: 41, ayah: 38 },
  { surah: 53, ayah: 62 },
  { surah: 84, ayah: 21 },
  { surah: 96, ayah: 19 },
];

const WORDS_PER_MINUTE = 150; // Average Arabic reading speed

export function isSajdahVerse(surahId: number, ayahNumber: number): boolean {
  return SAJDAH_VERSES.some((sajdah) => sajdah.surah === surahId && sajdah.ayah === ayahNumber);
}

export function getMemorizationSegments(arabicText: string): string[] {
  return arabicText
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

export function getWordCount(arabicText: string): number {
  return arabicText.split(/\s+/).filter((word) => word.trim().length > 0).length;
}

export function getEstimatedReadingTime(arabicText: string): number {
  const wordCount = getWordCount(arabicText);
  const timeInSeconds = Math.ceil((wordCount / WORDS_PER_MINUTE) * 60);
  return Math.max(timeInSeconds, 1); // Minimum 1 second
}

export function containsBismillah(arabicText: string): boolean {
  return arabicText.includes('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
}
