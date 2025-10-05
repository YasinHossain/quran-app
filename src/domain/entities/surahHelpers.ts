const SEVEN_LONG_SURAHS = [2, 3, 4, 5, 6, 7, 9];
const WORDS_PER_VERSE = 15; // Estimated average
const WORDS_PER_MINUTE = 150; // Reading speed

export function isShortSurah(numberOfAyahs: number): boolean {
  return numberOfAyahs < 20;
}

export function isMediumSurah(numberOfAyahs: number): boolean {
  return numberOfAyahs >= 20 && numberOfAyahs <= 100;
}

export function isLongSurah(numberOfAyahs: number): boolean {
  return numberOfAyahs > 100;
}

export function getMemorizationDifficulty(numberOfAyahs: number): 'easy' | 'medium' | 'hard' {
  if (numberOfAyahs <= 10) return 'easy';
  if (numberOfAyahs <= 50) return 'medium';
  return 'hard';
}

export function getSurahEstimatedReadingTime(numberOfAyahs: number): number {
  const totalWords = numberOfAyahs * WORDS_PER_VERSE;
  const timeInMinutes = totalWords / WORDS_PER_MINUTE;
  return Math.ceil(timeInMinutes);
}

export function isSevenLongSurah(id: number): boolean {
  return SEVEN_LONG_SURAHS.includes(id);
}

export function isMufassalSurah(id: number): boolean {
  return id >= 49;
}

export function getJuzNumbers(id: number): number[] {
  const juzStart = Math.ceil((id / 114) * 30);
  return [Math.max(1, Math.min(30, juzStart))];
}
