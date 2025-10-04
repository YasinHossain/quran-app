import { http, HttpResponse } from 'msw';

import { mockChapter, mockTafsir, mockTranslation, mockVerse } from '@/tests/setup/msw/mockData';

const QURAN_API_BASE = 'https://api.quran.com/api/v4';

const toNumber = (value: string | null, fallback: string): number => {
  return parseInt(value ?? fallback, 10);
};

export const quranApiHandlers = [
  http.get(`${QURAN_API_BASE}/chapters`, () => {
    return HttpResponse.json({
      chapters: [mockChapter],
    });
  }),
  http.get(`${QURAN_API_BASE}/chapters/:id`, ({ params }) => {
    const idParam = params['id'] as string | undefined;
    return HttpResponse.json({
      chapter: { ...mockChapter, id: parseInt(idParam ?? '0', 10) },
    });
  }),
  http.get(`${QURAN_API_BASE}/verses/by_chapter/:chapter_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = toNumber(url.searchParams.get('page'), '1');
    const perPage = toNumber(url.searchParams.get('per_page'), '10');

    const chapterIdParam = params['chapter_id'] as string | undefined;
    return HttpResponse.json({
      verses: [{ ...mockVerse, chapter_id: parseInt(chapterIdParam ?? '0', 10) }],
      pagination: {
        page,
        per_page: perPage,
        total_pages: 1,
        total_records: 1,
      },
    });
  }),
  http.get(`${QURAN_API_BASE}/verses/by_key/:verse_key`, ({ params }) => {
    const verseKeyParam = params['verse_key'] as string | undefined;
    return HttpResponse.json({
      verse: { ...mockVerse, verse_key: verseKeyParam },
    });
  }),
  http.get(`${QURAN_API_BASE}/resources/translations`, () => {
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
  http.get(`${QURAN_API_BASE}/quran/translations/:translation_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const chapterNumber = url.searchParams.get('chapter_number');
    const verseNumber = url.searchParams.get('verse_number');

    const translationIdParam = params['translation_id'] as string | undefined;
    return HttpResponse.json({
      translations: [
        {
          ...mockTranslation,
          resource_id: parseInt(translationIdParam ?? '0', 10),
          verse_key: `${chapterNumber}:${verseNumber}`,
        },
      ],
    });
  }),
  http.get(`${QURAN_API_BASE}/resources/tafsirs`, () => {
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
  http.get(`${QURAN_API_BASE}/quran/tafsirs/:tafsir_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const chapterNumber = url.searchParams.get('chapter_number');
    const verseNumber = url.searchParams.get('verse_number');

    const tafsirIdParam = params['tafsir_id'] as string | undefined;
    return HttpResponse.json({
      tafsirs: [
        {
          ...mockTafsir,
          resource_id: parseInt(tafsirIdParam ?? '0', 10),
          verse_key: `${chapterNumber}:${verseNumber}`,
        },
      ],
    });
  }),
  http.get(`${QURAN_API_BASE}/search`, ({ request }) => {
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
  http.get(`${QURAN_API_BASE}/verses/random`, () => {
    return HttpResponse.json({
      verse: mockVerse,
    });
  }),
];
