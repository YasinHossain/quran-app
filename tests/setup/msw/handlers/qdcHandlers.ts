import { http, HttpResponse } from 'msw';

import { mockChapter, mockTafsir, mockTranslation, mockVerse } from '@/tests/setup/msw/mockData';

const QDC_API_BASE = 'https://api.qurancdn.com/api/qdc';

const toNumber = (value: string | null, fallback: string): number => {
  return parseInt(value ?? fallback, 10);
};

export const qdcHandlers = [
  http.get(`${QDC_API_BASE}/chapters`, () => {
    return HttpResponse.json({
      chapters: [mockChapter],
    });
  }),
  http.get(`${QDC_API_BASE}/verses/by_chapter/:chapter_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = toNumber(url.searchParams.get('page'), '1');
    const perPage = toNumber(url.searchParams.get('per_page'), '10');

    return HttpResponse.json({
      verses: [{ ...mockVerse, chapter_id: parseInt(params.chapter_id as string, 10) }],
      pagination: {
        page,
        per_page: perPage,
        total_pages: 1,
        total_records: 1,
      },
    });
  }),
  http.get(`${QDC_API_BASE}/verses/by_juz/:juz`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = toNumber(url.searchParams.get('page'), '1');
    const perPage = toNumber(url.searchParams.get('per_page'), '10');

    return HttpResponse.json({
      verses: [{ ...mockVerse, juz_number: parseInt(params.juz as string, 10) }],
      pagination: {
        page,
        per_page: perPage,
        total_pages: 1,
        total_records: 1,
      },
    });
  }),
  http.get(`${QDC_API_BASE}/verses/by_page/:page`, ({ params, request }) => {
    const url = new URL(request.url);
    const perPage = toNumber(url.searchParams.get('per_page'), '10');
    const page = parseInt(params.page as string, 10);

    return HttpResponse.json({
      verses: [{ ...mockVerse, page_number: page }],
      pagination: {
        page,
        per_page: perPage,
        total_pages: 1,
        total_records: 1,
      },
    });
  }),
  http.get(`${QDC_API_BASE}/verses/by_key/:verse_key`, ({ params }) => {
    return HttpResponse.json({
      verse: { ...mockVerse, verse_key: params.verse_key },
    });
  }),
  http.get(`${QDC_API_BASE}/resources/translations`, ({ request }) => {
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
          resource_type: resourceType || undefined,
          translated_name: { name: 'Sahih International' },
        },
      ],
    });
  }),
  http.get(`${QDC_API_BASE}/quran/translations/:translation_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const chapterNumber = url.searchParams.get('chapter_number');
    const verseNumber = url.searchParams.get('verse_number');

    return HttpResponse.json({
      translations: [
        {
          ...mockTranslation,
          resource_id: parseInt(params.translation_id as string, 10),
          verse_key: `${chapterNumber}:${verseNumber}`,
        },
      ],
    });
  }),
  http.get(`${QDC_API_BASE}/resources/tafsirs`, () => {
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
  http.get(`${QDC_API_BASE}/quran/tafsirs/:tafsir_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const chapterNumber = url.searchParams.get('chapter_number');
    const verseNumber = url.searchParams.get('verse_number');

    return HttpResponse.json({
      tafsirs: [
        {
          ...mockTafsir,
          resource_id: parseInt(params.tafsir_id as string, 10),
          verse_key: `${chapterNumber}:${verseNumber}`,
        },
      ],
    });
  }),
  http.get(`${QDC_API_BASE}/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') ?? '';

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
  http.get(`${QDC_API_BASE}/verses/random`, () => {
    return HttpResponse.json({ verse: mockVerse });
  }),
];
