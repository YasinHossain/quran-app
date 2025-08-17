/**
 * Generates a JSON file with metadata for all juz of the Quran.
 *
 * This script writes `data/juz.json` containing juz numbers with corresponding
 * surah ranges. Surah metadata is fetched at runtime and is not included here.
 */
import { writeFile } from 'fs/promises';
import { getJuzMeta, surahNamesEn } from 'quran-meta';

interface JuzMeta {
  number: number;
  name: string;
  surahRange: string;
}

async function main() {
  const juzData: JuzMeta[] = [];
  for (let i = 1; i <= 30; i++) {
    const meta = getJuzMeta(i);
    const [startSurah, startAyah] = meta.first;
    const [endSurah, endAyah] = meta.last;
    const surahRange = `${surahNamesEn[startSurah][0]} ${startAyah} - ${surahNamesEn[endSurah][0]} ${endAyah}`;
    juzData.push({ number: i, name: `Juz ${i}`, surahRange });
  }
  await writeFile('data/juz.json', JSON.stringify(juzData, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
