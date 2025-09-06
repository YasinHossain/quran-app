import * as apiVerses from '../../../lib/api/verses';
import { Verse } from '../../domain/entities';
import { logger } from '../monitoring/Logger';
import { mapApiVerseToDomain } from './verseMapper';

export const findBySurah = async (surahId: number, translationId: number): Promise<Verse[]> => {
  try {
    const response = await apiVerses.getVersesByChapter(surahId, translationId, 1, 300);
    return response.verses.map((v) => mapApiVerseToDomain(v));
  } catch (error) {
    logger.error('Failed to find verses by surah:', undefined, error as Error);
    return [];
  }
};

export const findBySurahRange = async (
  surahId: number,
  fromAyah: number,
  toAyah: number,
  translationId: number
): Promise<Verse[]> => {
  try {
    const allVerses = await findBySurah(surahId, translationId);
    return allVerses.filter((v) => v.ayahNumber >= fromAyah && v.ayahNumber <= toAyah);
  } catch (error) {
    logger.error('Failed to find verses by surah range:', undefined, error as Error);
    return [];
  }
};

export const getCountBySurah = async (surahId: number, translationId: number): Promise<number> => {
  try {
    const verses = await findBySurah(surahId, translationId);
    return verses.length;
  } catch (error) {
    logger.error('Failed to get count by surah:', undefined, error as Error);
    return 0;
  }
};

export const findByJuz = async (juzNumber: number, translationId: number): Promise<Verse[]> => {
  try {
    const response = await apiVerses.getVersesByJuz(juzNumber, translationId, 1, 500);
    return response.verses.map((v) => mapApiVerseToDomain(v));
  } catch (error) {
    logger.error('Failed to find verses by juz:', undefined, error as Error);
    return [];
  }
};

export const findByPage = async (pageNumber: number, translationId: number): Promise<Verse[]> => {
  try {
    const response = await apiVerses.getVersesByPage(pageNumber, translationId, 1, 50);
    return response.verses.map((v) => mapApiVerseToDomain(v));
  } catch (error) {
    logger.error('Failed to find verses by page:', undefined, error as Error);
    return [];
  }
};

export const findByHizb = async (hizbNumber: number, translationId: number): Promise<Verse[]> => {
  const juzNumber = Math.ceil(hizbNumber / 2);
  const isSecondHalf = hizbNumber % 2 === 0;

  const juzVerses = await findByJuz(juzNumber, translationId);
  const mid = Math.floor(juzVerses.length / 2);

  return isSecondHalf ? juzVerses.slice(mid) : juzVerses.slice(0, mid);
};

export const findByRubAlHizb = async (
  rubNumber: number,
  translationId: number
): Promise<Verse[]> => {
  const hizbNumber = Math.ceil(rubNumber / 4);
  const rubInHizb = ((rubNumber - 1) % 4) + 1;

  const hizbVerses = await findByHizb(hizbNumber, translationId);
  const segmentSize = Math.floor(hizbVerses.length / 4);
  const startIndex = (rubInHizb - 1) * segmentSize;
  const endIndex = rubInHizb === 4 ? hizbVerses.length : startIndex + segmentSize;

  return hizbVerses.slice(startIndex, endIndex);
};

export const findSajdahVerses = async (translationId: number): Promise<Verse[]> => {
  const sajdahPositions = [
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

  const verses: Verse[] = [];
  for (const pos of sajdahPositions) {
    const verse = await apiVerses.getVerseByKey(`${pos.surah}:${pos.ayah}`, translationId);
    verses.push(mapApiVerseToDomain(verse));
  }
  return verses;
};

export const findFirstVerses = async (translationId: number): Promise<Verse[]> => {
  const verses: Verse[] = [];
  for (let surahId = 1; surahId <= 114; surahId++) {
    const verse = await apiVerses.getVerseByKey(`${surahId}:1`, translationId);
    verses.push(mapApiVerseToDomain(verse));
  }
  return verses;
};

export const findByVerseKeys = async (
  verseKeys: string[],
  translationId: number
): Promise<Verse[]> => {
  const verses: Verse[] = [];
  for (const key of verseKeys) {
    try {
      const apiVerse = await apiVerses.getVerseByKey(key, translationId);
      verses.push(mapApiVerseToDomain(apiVerse));
    } catch (error) {
      logger.error(`Failed to fetch verse ${key}:`, undefined, error as Error);
    }
  }
  return verses;
};

export const findRandom = async (
  _count = 1,
  _surahId: number | undefined,
  translationId: number
): Promise<Verse[]> => {
  try {
    const randomVerse = await apiVerses.getRandomVerse(translationId);
    return [mapApiVerseToDomain(randomVerse)];
  } catch (error) {
    logger.error('Failed to find random verse:', undefined, error as Error);
    return [];
  }
};

export const getTotalCount = async (): Promise<number> => 6236;
