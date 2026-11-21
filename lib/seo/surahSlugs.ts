/**
 * Canonical surah URL slugs (`/surah/al-baqarah/255`), one per surah, index 0 = surah 1.
 *
 * Generated once from the Quran.com chapter `name_simple` (English): lowercase, apostrophes
 * removed, spaces and hyphens collapsed into one hyphen ("Ali 'Imran" -> `ali-imran`). The slug is
 * the same Latin string in every language. Checked in (not fetched) because routing (`proxy.ts`)
 * needs it synchronously and URLs must never change when the API's spelling does.
 */
export const SURAH_SLUGS = [
  'al-fatihah',
  'al-baqarah',
  'ali-imran',
  'an-nisa',
  'al-maidah',
  'al-anam',
  'al-araf',
  'al-anfal',
  'at-tawbah',
  'yunus',
  'hud',
  'yusuf',
  'ar-rad',
  'ibrahim',
  'al-hijr',
  'an-nahl',
  'al-isra',
  'al-kahf',
  'maryam',
  'taha',
  'al-anbya',
  'al-hajj',
  'al-muminun',
  'an-nur',
  'al-furqan',
  'ash-shuara',
  'an-naml',
  'al-qasas',
  'al-ankabut',
  'ar-rum',
  'luqman',
  'as-sajdah',
  'al-ahzab',
  'saba',
  'fatir',
  'ya-sin',
  'as-saffat',
  'sad',
  'az-zumar',
  'ghafir',
  'fussilat',
  'ash-shuraa',
  'az-zukhruf',
  'ad-dukhan',
  'al-jathiyah',
  'al-ahqaf',
  'muhammad',
  'al-fath',
  'al-hujurat',
  'qaf',
  'adh-dhariyat',
  'at-tur',
  'an-najm',
  'al-qamar',
  'ar-rahman',
  'al-waqiah',
  'al-hadid',
  'al-mujadila',
  'al-hashr',
  'al-mumtahanah',
  'as-saf',
  'al-jumuah',
  'al-munafiqun',
  'at-taghabun',
  'at-talaq',
  'at-tahrim',
  'al-mulk',
  'al-qalam',
  'al-haqqah',
  'al-maarij',
  'nuh',
  'al-jinn',
  'al-muzzammil',
  'al-muddaththir',
  'al-qiyamah',
  'al-insan',
  'al-mursalat',
  'an-naba',
  'an-naziat',
  'abasa',
  'at-takwir',
  'al-infitar',
  'al-mutaffifin',
  'al-inshiqaq',
  'al-buruj',
  'at-tariq',
  'al-ala',
  'al-ghashiyah',
  'al-fajr',
  'al-balad',
  'ash-shams',
  'al-layl',
  'ad-duhaa',
  'ash-sharh',
  'at-tin',
  'al-alaq',
  'al-qadr',
  'al-bayyinah',
  'az-zalzalah',
  'al-adiyat',
  'al-qariah',
  'at-takathur',
  'al-asr',
  'al-humazah',
  'al-fil',
  'quraysh',
  'al-maun',
  'al-kawthar',
  'al-kafirun',
  'an-nasr',
  'al-masad',
  'al-ikhlas',
  'al-falaq',
  'an-nas',
] as const;

export type SurahSlug = (typeof SURAH_SLUGS)[number];

export const SURAH_COUNT = SURAH_SLUGS.length;

/**
 * Verse count of each surah (index 0 = surah 1), generated once from the Quran.com chapter
 * `verses_count` (sum 6,236). Checked in for the same reason as the slugs: `proxy.ts` validates
 * verse numbers synchronously so invalid ones 404 without a redirect. Pages still validate against
 * chapter data.
 */
export const SURAH_VERSE_COUNTS: ReadonlyArray<number> = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112,
  78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37,
  35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8,
  8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

/** Verse count of surah `id`, or 0 when out of range. */
export function getSurahVerseCount(id: number): number {
  return Number.isInteger(id) ? (SURAH_VERSE_COUNTS[id - 1] ?? 0) : 0;
}

/** Slug of surah `id` (1–114), or `undefined` when out of range. */
export function getSurahSlug(id: number): SurahSlug | undefined {
  return Number.isInteger(id) ? SURAH_SLUGS[id - 1] : undefined;
}

const CANONICAL_ID = /^[1-9]\d{0,2}$/;

/*
 * Loose matching for typed or legacy URLs (`/surah/baqarah`, `/surah/Yaseen`, `/surah/2`). Keys
 * are compared without case, accents, punctuation, hyphens or spaces, and with or without the
 * Arabic article. A key shared by two surahs is dropped, so every alias is unambiguous.
 */
const ARTICLE = /^(?:adh|ash|ath|al|an|ar|as|at|az|ad)(?=[a-z]{2})/;

export function normalizeSurahKey(input: string): string {
  let text = input;
  try {
    text = decodeURIComponent(input);
  } catch {
    // Keep malformed escapes as typed.
  }
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Looser form: no article, no trailing `h`, no doubled letters (`al-fatihah` -> `fatia`). */
const looseKey = (key: string): string =>
  key
    .replace(ARTICLE, '')
    .replace(/h$/, '')
    .replace(/(.)\1+/g, '$1');

/** Common spellings that the loose form does not reach. Values are surah numbers. */
export const COMMON_SPELLINGS: Readonly<Record<string, number>> = {
  fatiha: 1,
  alhamd: 1,
  baqara: 2,
  imran: 3,
  aleimran: 3,
  alimran: 3,
  nisaa: 4,
  maida: 5,
  anaam: 6,
  aaraf: 7,
  tauba: 9,
  taubah: 9,
  tawba: 9,
  baraah: 9,
  yoonus: 10,
  yousuf: 12,
  yusof: 12,
  raad: 13,
  ibraheem: 14,
  baniisrail: 17,
  israa: 17,
  kahaf: 18,
  mariam: 19,
  maryum: 19,
  tahaa: 20,
  anbiya: 21,
  anbiyaa: 21,
  muminoon: 23,
  noor: 24,
  shuaraa: 26,
  ankaboot: 29,
  room: 30,
  lukman: 31,
  sajda: 32,
  sabaa: 34,
  faatir: 35,
  yasin: 36,
  yaseen: 36,
  yaasin: 36,
  yaaseen: 36,
  saaffat: 37,
  saad: 38,
  zumr: 39,
  mumin: 40,
  fussilat: 41,
  hamimsajdah: 41,
  shura: 42,
  zukhruf: 43,
  jathiya: 45,
  ahqaaf: 46,
  fatah: 48,
  qaaf: 50,
  dhariyat: 51,
  zariyat: 51,
  toor: 52,
  rahmaan: 55,
  waqia: 56,
  waqiya: 56,
  waqiyah: 56,
  mujadilah: 58,
  mujadalah: 58,
  mumtahina: 60,
  mumtahinah: 60,
  jumua: 62,
  juma: 62,
  jummah: 62,
  munafiqoon: 63,
  tagabun: 64,
  tahreem: 66,
  haaqqa: 69,
  maarij: 70,
  nooh: 71,
  jin: 72,
  muzammil: 73,
  muzzamil: 73,
  muddathir: 74,
  muddassir: 74,
  mudassir: 74,
  qiyama: 75,
  dahr: 76,
  insaan: 76,
  nabaa: 78,
  naziyat: 79,
  nazeat: 79,
  takweer: 81,
  mutaffifeen: 83,
  burooj: 85,
  taariq: 86,
  aala: 87,
  ghashiya: 88,
  lail: 92,

  duha: 93,
  dhuha: 93,
  inshirah: 94,
  alamnashrah: 94,
  teen: 95,
  alaq: 96,
  iqra: 96,
  qadar: 97,
  bayyina: 98,
  bayinah: 98,
  zilzal: 99,
  zalzala: 99,
  adiyaat: 100,
  qaria: 101,
  qariah: 101,
  takasur: 102,
  humaza: 104,
  feel: 105,
  quraish: 106,
  qurayish: 106,
  maoon: 107,
  kausar: 108,
  kauthar: 108,
  kawsar: 108,
  kafiroon: 109,
  kafirun: 109,
  lahab: 111,
  tabbat: 111,
  ikhlaas: 112,
  tawhid: 112,
  falak: 113,
  naas: 114,
};

function buildAliasIndex(): ReadonlyMap<string, number> {
  const owners = new Map<string, Set<number>>();
  const add = (key: string, id: number): void => {
    if (!key) return;
    const set = owners.get(key) ?? new Set<number>();
    set.add(id);
    owners.set(key, set);
  };

  SURAH_SLUGS.forEach((slug, index) => {
    const key = normalizeSurahKey(slug);
    add(key, index + 1);
    add(key.replace(ARTICLE, ''), index + 1);
    add(looseKey(key), index + 1);
  });
  for (const [alias, id] of Object.entries(COMMON_SPELLINGS)) {
    add(alias, id);
    add(looseKey(alias), id);
  }

  const index = new Map<string, number>();
  for (const [key, ids] of owners) {
    if (ids.size === 1) index.set(key, [...ids][0]!);
  }
  return index;
}

let aliasIndex: ReadonlyMap<string, number> | null = null;

/** Every unambiguous alias key and its surah (exposed for tests). */
export function getSurahAliasIndex(): ReadonlyMap<string, number> {
  aliasIndex ??= buildAliasIndex();
  return aliasIndex;
}

export interface ResolvedSurahParam {
  id: number;
  slug: SurahSlug;
  /** The input already is the canonical slug (no redirect needed). */
  canonical: boolean;
}

/**
 * Resolves a surah route segment: the canonical slug, a surah number (`2`), or a loose spelling
 * (`baqarah`, `Al-Baqara`, `yaseen`). `null` when it names no surah.
 */
export function resolveSurahParam(raw: string): ResolvedSurahParam | null {
  if (!raw) return null;
  const exact = SURAH_SLUGS.indexOf(raw as SurahSlug);
  if (exact >= 0) return { id: exact + 1, slug: SURAH_SLUGS[exact]!, canonical: true };

  let id: number | undefined;
  if (CANONICAL_ID.test(raw)) {
    id = Number(raw);
  } else {
    const key = normalizeSurahKey(raw);
    if (key.length > 64) return null;
    const index = getSurahAliasIndex();
    id = index.get(key) ?? index.get(key.replace(ARTICLE, '')) ?? index.get(looseKey(key));
  }
  const slug = id === undefined ? undefined : getSurahSlug(id);
  return id !== undefined && slug ? { id, slug, canonical: false } : null;
}
