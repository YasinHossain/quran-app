import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { QuranAPI } from '../api/quran.js';

const quranAPI = new QuranAPI();

export const quranTools: Tool[] = [
  {
    name: 'get_chapters',
    description: 'Get list of all Quran chapters (surahs) with metadata',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_chapter',
    description: 'Get detailed information about a specific chapter',
    inputSchema: {
      type: 'object',
      properties: {
        chapterId: {
          type: 'number',
          description: 'Chapter ID (1-114)',
          minimum: 1,
          maximum: 114,
        },
      },
      required: ['chapterId'],
    },
  },
  {
    name: 'get_verses_by_chapter',
    description: 'Get verses from a specific chapter with translations',
    inputSchema: {
      type: 'object',
      properties: {
        chapterId: {
          type: 'number',
          description: 'Chapter ID (1-114)',
          minimum: 1,
          maximum: 114,
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs (default: [20] for Sahih International)',
          default: [20],
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
          default: 1,
        },
        perPage: {
          type: 'number',
          description: 'Number of verses per page (default: 50)',
          minimum: 1,
          maximum: 100,
          default: 50,
        },
        wordLang: {
          type: 'string',
          description: 'Language for word-by-word translation (default: en)',
          default: 'en',
        },
      },
      required: ['chapterId'],
    },
  },
  {
    name: 'get_verses_by_juz',
    description: 'Get verses from a specific juz (para) with translations',
    inputSchema: {
      type: 'object',
      properties: {
        juzId: {
          type: 'number',
          description: 'Juz ID (1-30)',
          minimum: 1,
          maximum: 30,
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs (default: [20] for Sahih International)',
          default: [20],
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
          default: 1,
        },
        perPage: {
          type: 'number',
          description: 'Number of verses per page (default: 50)',
          minimum: 1,
          maximum: 100,
          default: 50,
        },
      },
      required: ['juzId'],
    },
  },
  {
    name: 'get_verses_by_page',
    description: 'Get verses from a specific Mushaf page with translations',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'number',
          description: 'Page ID (1-604)',
          minimum: 1,
          maximum: 604,
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs (default: [20] for Sahih International)',
          default: [20],
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
          default: 1,
        },
        perPage: {
          type: 'number',
          description: 'Number of verses per page (default: 50)',
          minimum: 1,
          maximum: 100,
          default: 50,
        },
      },
      required: ['pageId'],
    },
  },
  {
    name: 'get_verse',
    description: 'Get a specific verse by ID with translations',
    inputSchema: {
      type: 'object',
      properties: {
        verseId: {
          type: 'number',
          description: 'Verse ID',
          minimum: 1,
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs (default: [20] for Sahih International)',
          default: [20],
        },
      },
      required: ['verseId'],
    },
  },
  {
    name: 'search_verses',
    description: 'Search for verses containing specific text or keywords',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (Arabic or English)',
          minLength: 1,
        },
        size: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
          minimum: 1,
          maximum: 50,
          default: 20,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_random_verse',
    description: 'Get a random verse with translation',
    inputSchema: {
      type: 'object',
      properties: {
        translationId: {
          type: 'number',
          description: 'Translation ID (default: 20 for Sahih International)',
          default: 20,
        },
      },
      required: [],
    },
  },
  {
    name: 'get_juz_metadata',
    description: 'Get metadata for all 30 Juz (Para) including names and surah ranges',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_juz',
    description: 'Get detailed information about a specific juz',
    inputSchema: {
      type: 'object',
      properties: {
        juzId: {
          type: 'number',
          description: 'Juz ID (1-30)',
          minimum: 1,
          maximum: 30,
        },
      },
      required: ['juzId'],
    },
  },
  {
    name: 'get_translations',
    description: 'Get available translation resources',
    inputSchema: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description: 'Filter by language code (e.g., "en", "ar", "ur")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_tafsir_resources',
    description: 'Get available tafsir (commentary) resources',
    inputSchema: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description: 'Filter by language code (e.g., "en", "ar", "ur")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_tafsir',
    description: 'Get tafsir (commentary) for a specific verse',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
        tafsirId: {
          type: 'number',
          description: 'Tafsir resource ID',
          minimum: 1,
        },
      },
      required: ['verseKey', 'tafsirId'],
    },
  },
];

export async function handleQuranTool(name: string, args: any): Promise<any> {
  switch (name) {
    case 'get_chapters':
      return await quranAPI.getChapters();

    case 'get_chapter':
      return await quranAPI.getChapter(args.chapterId);

    case 'get_verses_by_chapter':
      return await quranAPI.getVersesByChapter(
        args.chapterId,
        args.translationIds || [20],
        args.page || 1,
        args.perPage || 50,
        args.wordLang || 'en'
      );

    case 'get_verses_by_juz':
      return await quranAPI.getVersesByJuz(
        args.juzId,
        args.translationIds || [20],
        args.page || 1,
        args.perPage || 50
      );

    case 'get_verses_by_page':
      return await quranAPI.getVersesByPage(
        args.pageId,
        args.translationIds || [20],
        args.page || 1,
        args.perPage || 50
      );

    case 'get_verse':
      return await quranAPI.getVerse(
        args.verseId,
        args.translationIds || [20]
      );

    case 'search_verses':
      return await quranAPI.searchVerses(args.query, args.size || 20);

    case 'get_random_verse':
      return await quranAPI.getRandomVerse(args.translationId || 20);

    case 'get_juz_metadata':
      return quranAPI.getJuzMetadata();

    case 'get_juz':
      return await quranAPI.getJuz(args.juzId);

    case 'get_translations':
      return await quranAPI.getTranslations(args.language);

    case 'get_tafsir_resources':
      return await quranAPI.getTafsirResources(args.language);

    case 'get_tafsir':
      return await quranAPI.getTafsir(args.verseKey, args.tafsirId);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}