import * as apiVerses from '../../../../lib/api/verses';
import { Verse } from '../../../domain/entities/Verse';
import { mapApiVerseToDomain } from '../verseMapper';

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

