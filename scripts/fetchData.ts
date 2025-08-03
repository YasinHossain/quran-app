/**
 * Generates JSON files with metadata for all surahs and juz of the Quran.
 *
 * This script has no arguments and writes the following files:
 * - `data/surahs.json` — surah numbers, names, verse counts, and meanings.
 * - `data/juz.json` — juz numbers with corresponding surah ranges.
 */
import { writeFile } from 'fs/promises';
import { getJuzMeta, getSurahMeta, surahNamesEn } from 'quran-meta';

interface SurahMeta {
  number: number;
  name: string;
  arabicName: string;
  verses: number;
  meaning: string;
}

interface JuzMeta {
  number: number;
  name: string;
  surahRange: string;
}

async function main() {
  const surahs: SurahMeta[] = [];
  for (let i = 1; i <= 114; i++) {
    const meta = getSurahMeta(i);
    const [name, meaning] = surahNamesEn[i];
    surahs.push({
      number: i,
      name,
      arabicName: meta.name,
      verses: meta.ayahCount,
      meaning,
    });
  }
  await writeFile('data/surahs.json', JSON.stringify(surahs, null, 2) + '\n');

  const surahNames: Record<number, string> = {};
  surahs.forEach((s) => {
    surahNames[s.number] = s.name;
  });

  const juzData: JuzMeta[] = [];
  for (let i = 1; i <= 30; i++) {
    const meta = getJuzMeta(i);
    const [startSurah, startAyah] = meta.first;
    const [endSurah, endAyah] = meta.last;
    const surahRange = `${surahNames[startSurah]} ${startAyah} - ${surahNames[endSurah]} ${endAyah}`;
    juzData.push({ number: i, name: `Juz ${i}`, surahRange });
  }
  await writeFile('data/juz.json', JSON.stringify(juzData, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
