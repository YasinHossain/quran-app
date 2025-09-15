import { http, HttpResponse } from 'msw';

import { mockChapter, mockVerse, mockTranslation, mockTafsir } from './mockData';

export const qdcHandlers = [
  // Chapters API
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
    },
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
    },
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
];
