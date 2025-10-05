// Shared mock data for MSW handlers
export const mockChapter = {
  id: 1,
  revelation_place: 'makkah',
  revelation_order: 5,
  bismillah_pre: true,
  name_simple: 'Al-Fatihah',
  name_complex: 'Al-Fātiḥah',
  name_arabic: 'الفاتحة',
  verses_count: 7,
  pages: [1, 1],
  translated_name: {
    language_name: 'english',
    name: 'The Opening',
  },
};

export const mockVerse = {
  id: 1,
  verse_number: 1,
  verse_key: '1:1',
  hizb_number: 1,
  rub_el_hizb_number: 1,
  ruku_number: 1,
  manzil_number: 1,
  sajdah_number: null,
  chapter_id: 1,
  page_number: 1,
  juz_number: 1,
  text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
  text_imlaei: 'بسم الله الرحمن الرحيم',
  text_imlaei_simple: 'بسم الله الرحمن الرحيم',
};

export const mockTranslation = {
  id: 1,
  resource_id: 131,
  text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
};

export const mockTafsir = {
  id: 1,
  resource_id: 169,
  text: 'This is a test tafsir content for verse 1:1.',
};
