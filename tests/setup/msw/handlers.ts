// Mock Service Worker handlers for Quran API
import { http, HttpResponse } from 'msw';

// Mock data for testing
const mockChapter = {
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

const mockVerse = {
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

const mockTranslation = {
  id: 1,
  resource_id: 131,
  text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
};

const mockTafsir = {
  id: 1,
  resource_id: 169,
  text: 'This is a test tafsir content for verse 1:1.',
};

export const handlers = [
  // Chapters API
  http.get('https://api.quran.com/api/v4/chapters', () => {
    return HttpResponse.json({
      chapters: [mockChapter],
    });
  }),
  // CDN-backed QDC Chapters API
  http.get('https://api.qurancdn.com/api/qdc/chapters', () => {
    return HttpResponse.json({
      chapters: [mockChapter],
    });
  }),

  // QDC Verses APIs
  http.get(
    'https://api.qurancdn.com/api/qdc/verses/by_chapter/:chapter_id',
    ({ params, request }) => {
      const url = new URL(request.url);
      const page = url.searchParams.get('page') || '1';
      const perPage = url.searchParams.get('per_page') || '10';

      return HttpResponse.json({
        verses: [{ ...mockVerse, chapter_id: parseInt(params.chapter_id as string) }],
        pagination: {
          page: parseInt(page),
          per_page: parseInt(perPage),
          total_pages: 1,
          total_records: 1,
        },
      });
    }
  ),
  http.get('https://api.qurancdn.com/api/qdc/verses/by_juz/:juz', ({ params, request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('per_page') || '10';
    return HttpResponse.json({
      verses: [{ ...mockVerse, juz_number: parseInt(params.juz as string) }],
      pagination: {
        page: parseInt(page),
        per_page: parseInt(perPage),
        total_pages: 1,
        total_records: 1,
      },
    });
  }),
  http.get('https://api.qurancdn.com/api/qdc/verses/by_page/:page', ({ params, request }) => {
    const url = new URL(request.url);
    const perPage = url.searchParams.get('per_page') || '10';
    return HttpResponse.json({
      verses: [{ ...mockVerse, page_number: parseInt(params.page as string) }],
      pagination: {
        page: parseInt(params.page as string),
        per_page: parseInt(perPage),
        total_pages: 1,
        total_records: 1,
      },
    });
  }),
  http.get('https://api.qurancdn.com/api/qdc/verses/by_key/:verse_key', ({ params }) => {
    return HttpResponse.json({
      verse: { ...mockVerse, verse_key: params.verse_key },
    });
  }),

  // QDC Translations
  http.get('https://api.qurancdn.com/api/qdc/resources/translations', ({ request }) => {
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('resource_type');
    return HttpResponse.json({
      translations: [
        {
          id: 131,
          name: 'Sahih International',
          author_name: 'Sahih International',
          slug: 'sahih_international',
          language_name: 'english',
          resource_type,
          translated_name: { name: 'Sahih International' },
        },
      ],
    });
  }),
  http.get(
    'https://api.qurancdn.com/api/qdc/quran/translations/:translation_id',
    ({ params, request }) => {
      const url = new URL(request.url);
      const chapterNumber = url.searchParams.get('chapter_number');
      const verseNumber = url.searchParams.get('verse_number');
      return HttpResponse.json({
        translations: [
          {
            ...mockTranslation,
            resource_id: parseInt(params.translation_id as string),
            verse_key: `${chapterNumber}:${verseNumber}`,
          },
        ],
      });
    }
  ),

  // QDC Tafsir
  http.get('https://api.qurancdn.com/api/qdc/resources/tafsirs', () => {
    return HttpResponse.json({
      tafsirs: [
        {
          id: 169,
          name: 'Tafsir Ibn Kathir',
          author_name: 'Ibn Kathir',
          slug: 'ibn_kathir',
          language_name: 'english',
          translated_name: { name: 'Tafsir Ibn Kathir' },
        },
      ],
    });
  }),
  http.get('https://api.qurancdn.com/api/qdc/quran/tafsirs/:tafsir_id', ({ params, request }) => {
    const url = new URL(request.url);
    const chapterNumber = url.searchParams.get('chapter_number');
    const verseNumber = url.searchParams.get('verse_number');
    return HttpResponse.json({
      tafsirs: [
        {
          ...mockTafsir,
          resource_id: parseInt(params.tafsir_id as string),
          verse_key: `${chapterNumber}:${verseNumber}`,
        },
      ],
    });
  }),

  // QDC Search
  http.get('https://api.qurancdn.com/api/qdc/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    return HttpResponse.json({
      search: {
        query,
        total_results: 1,
        current_page: 1,
        total_pages: 1,
        results: [
          {
            verse_key: '1:1',
            verse_id: 1,
            text: mockVerse.text_uthmani,
            highlighted: mockVerse.text_uthmani,
            translation: mockTranslation.text,
            chapter_id: 1,
            verse_number: 1,
          },
        ],
      },
    });
  }),

  // QDC random verse
  http.get('https://api.qurancdn.com/api/qdc/verses/random', () => {
    return HttpResponse.json({ verse: mockVerse });
  }),

  http.get('https://api.quran.com/api/v4/chapters/:id', ({ params }) => {
    return HttpResponse.json({
      chapter: { ...mockChapter, id: parseInt(params.id as string) },
    });
  }),

  // Verses API
  http.get('https://api.quran.com/api/v4/verses/by_chapter/:chapter_id', ({ params, request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('per_page') || '10';

    return HttpResponse.json({
      verses: [{ ...mockVerse, chapter_id: parseInt(params.chapter_id as string) }],
      pagination: {
        page: parseInt(page),
        per_page: parseInt(perPage),
        total_pages: 1,
        total_records: 1,
      },
    });
  }),

  http.get('https://api.quran.com/api/v4/verses/by_key/:verse_key', ({ params }) => {
    return HttpResponse.json({
      verse: { ...mockVerse, verse_key: params.verse_key },
    });
  }),

  // Translations API
  http.get('https://api.quran.com/api/v4/resources/translations', () => {
    return HttpResponse.json({
      translations: [
        {
          id: 131,
          name: 'Sahih International',
          author_name: 'Sahih International',
          slug: 'sahih_international',
          language_name: 'english',
          translated_name: { name: 'Sahih International' },
        },
      ],
    });
  }),

  http.get(
    'https://api.quran.com/api/v4/quran/translations/:translation_id',
    ({ params, request }) => {
      const url = new URL(request.url);
      const chapterNumber = url.searchParams.get('chapter_number');
      const verseNumber = url.searchParams.get('verse_number');

      return HttpResponse.json({
        translations: [
          {
            ...mockTranslation,
            resource_id: parseInt(params.translation_id as string),
            verse_key: `${chapterNumber}:${verseNumber}`,
          },
        ],
      });
    }
  ),

  // Tafsir API
  http.get('https://api.quran.com/api/v4/resources/tafsirs', () => {
    return HttpResponse.json({
      tafsirs: [
        {
          id: 169,
          name: 'Tafsir Ibn Kathir',
          author_name: 'Ibn Kathir',
          slug: 'ibn_kathir',
          language_name: 'english',
          translated_name: { name: 'Tafsir Ibn Kathir' },
        },
      ],
    });
  }),

  http.get('https://api.quran.com/api/v4/quran/tafsirs/:tafsir_id', ({ params, request }) => {
    const url = new URL(request.url);
    const chapterNumber = url.searchParams.get('chapter_number');
    const verseNumber = url.searchParams.get('verse_number');

    return HttpResponse.json({
      tafsirs: [
        {
          ...mockTafsir,
          resource_id: parseInt(params.tafsir_id as string),
          verse_key: `${chapterNumber}:${verseNumber}`,
        },
      ],
    });
  }),

  // Audio API
  http.get('https://verses.quran.com/:path*', () => {
    // Return a mock audio response (empty blob for tests)
    return new HttpResponse(new Blob(), {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  }),

  // CDN Images
  http.get('https://cdn.quran.com/:path*', () => {
    // Return a mock image response (empty blob for tests)
    return new HttpResponse(new Blob(), {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }),

  // Search API
  http.get('https://api.quran.com/api/v4/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    return HttpResponse.json({
      search: {
        query,
        total_results: 1,
        current_page: 1,
        total_pages: 1,
        results: [
          {
            verse_key: '1:1',
            verse_id: 1,
            text: mockVerse.text_uthmani,
            highlighted: mockVerse.text_uthmani,
            translation: mockTranslation.text,
            chapter_id: 1,
            verse_number: 1,
          },
        ],
      },
    });
  }),

  // Random verse API
  http.get('https://api.quran.com/api/v4/verses/random', () => {
    return HttpResponse.json({
      verse: mockVerse,
    });
  }),
];
