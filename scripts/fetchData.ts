const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

import { writeFile } from 'fs/promises';

interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  translated_name?: { name: string };
}

interface JuzApi {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
}

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

async function fetchSurahs(): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE_URL}/chapters?language=en`);
  if (!res.ok) {
    throw new Error(`Failed to fetch chapters: ${res.status}`);
  }
  const data = await res.json();
  return data.chapters as Chapter[];
}

async function fetchJuz(num: number): Promise<JuzApi> {
  const res = await fetch(`${API_BASE_URL}/juzs/${num}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch juz ${num}: ${res.status}`);
  }
  const data = await res.json();
  return data.juz as JuzApi;
}

async function main() {
  const chapters = await fetchSurahs();
  const surahs: SurahMeta[] = chapters.map((ch) => ({
    number: ch.id,
    name: ch.name_simple,
    arabicName: ch.name_arabic,
    verses: ch.verses_count,
    meaning: ch.translated_name?.name ?? '',
  }));
  await writeFile('data/surahs.json', JSON.stringify(surahs, null, 2) + '\n');

  const surahNames: Record<number, string> = {};
  surahs.forEach((s) => {
    surahNames[s.number] = s.name;
  });

  const juzData: JuzMeta[] = [];
  for (let i = 1; i <= 30; i++) {
    const juz = await fetchJuz(i);
    const ids = Object.keys(juz.verse_mapping).map(Number);
    const firstId = ids[0];
    const lastId = ids[ids.length - 1];
    const startVerse = juz.verse_mapping[firstId].split('-')[0];
    const endVerse = juz.verse_mapping[lastId].split('-')[1];
    const surahRange = `${surahNames[firstId]} ${startVerse} - ${surahNames[lastId]} ${endVerse}`;
    juzData.push({ number: juz.juz_number, name: `Juz ${juz.juz_number}`, surahRange });
  }
  await writeFile('data/juz.json', JSON.stringify(juzData, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
