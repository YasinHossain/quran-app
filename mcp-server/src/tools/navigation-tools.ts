import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { QuranAPI } from '../api/quran.js';

const quranAPI = new QuranAPI();

export const navigationTools: Tool[] = [
  {
    name: 'navigate_to_verse',
    description: 'Get navigation information for a specific verse',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs to include',
          default: [20],
        },
      },
      required: ['verseKey'],
    },
  },
  {
    name: 'get_verse_context',
    description: 'Get surrounding verses for context around a specific verse',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
        contextBefore: {
          type: 'number',
          description: 'Number of verses to include before the target verse (default: 2)',
          minimum: 0,
          maximum: 10,
          default: 2,
        },
        contextAfter: {
          type: 'number',
          description: 'Number of verses to include after the target verse (default: 2)',
          minimum: 0,
          maximum: 10,
          default: 2,
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs to include',
          default: [20],
        },
      },
      required: ['verseKey'],
    },
  },
  {
    name: 'find_verse_by_reference',
    description: 'Find verses by chapter and verse number or range',
    inputSchema: {
      type: 'object',
      properties: {
        chapterNumber: {
          type: 'number',
          description: 'Chapter number (1-114)',
          minimum: 1,
          maximum: 114,
        },
        verseStart: {
          type: 'number',
          description: 'Starting verse number',
          minimum: 1,
        },
        verseEnd: {
          type: 'number',
          description: 'Ending verse number (optional, for ranges)',
          minimum: 1,
        },
        translationIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of translation IDs to include',
          default: [20],
        },
      },
      required: ['chapterNumber', 'verseStart'],
    },
  },
  {
    name: 'get_surah_navigation',
    description: 'Get navigation information within a surah (previous/next verses, chapter info)',
    inputSchema: {
      type: 'object',
      properties: {
        chapterId: {
          type: 'number',
          description: 'Chapter ID (1-114)',
          minimum: 1,
          maximum: 114,
        },
        currentVerse: {
          type: 'number',
          description: 'Current verse number (optional)',
          minimum: 1,
        },
      },
      required: ['chapterId'],
    },
  },
  {
    name: 'get_page_navigation',
    description: 'Get navigation information for Mushaf pages',
    inputSchema: {
      type: 'object',
      properties: {
        pageNumber: {
          type: 'number',
          description: 'Page number (1-604)',
          minimum: 1,
          maximum: 604,
        },
      },
      required: ['pageNumber'],
    },
  },
  {
    name: 'get_juz_navigation',
    description: 'Get navigation information for Juz (Para)',
    inputSchema: {
      type: 'object',
      properties: {
        juzNumber: {
          type: 'number',
          description: 'Juz number (1-30)',
          minimum: 1,
          maximum: 30,
        },
      },
      required: ['juzNumber'],
    },
  },
  {
    name: 'find_verse_location',
    description: 'Find which page and juz a verse belongs to',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
      },
      required: ['verseKey'],
    },
  },
];

export async function handleNavigationTool(name: string, args: any): Promise<any> {
  switch (name) {
    case 'navigate_to_verse': {
      const [chapterStr, verseStr] = args.verseKey.split(':');
      const chapterId = parseInt(chapterStr);
      const verseNumber = parseInt(verseStr);
      
      const chapter = await quranAPI.getChapter(chapterId);
      if (!chapter) {
        return { error: 'Chapter not found' };
      }

      // Calculate verse ID (approximate)
      const verses = await quranAPI.getVersesByChapter(chapterId, args.translationIds || [20], 1, chapter.verses_count);
      const targetVerse = verses.data.find(v => {
        const [, vNum] = v.verse_key.split(':');
        return parseInt(vNum) === verseNumber;
      });

      return {
        chapter,
        verse: targetVerse,
        navigation: {
          hasNext: verseNumber < chapter.verses_count,
          hasPrevious: verseNumber > 1,
          nextVerse: verseNumber < chapter.verses_count ? `${chapterId}:${verseNumber + 1}` : null,
          previousVerse: verseNumber > 1 ? `${chapterId}:${verseNumber - 1}` : null,
        },
      };
    }

    case 'get_verse_context': {
      const [chapterStr, verseStr] = args.verseKey.split(':');
      const chapterId = parseInt(chapterStr);
      const verseNumber = parseInt(verseStr);
      const contextBefore = args.contextBefore || 2;
      const contextAfter = args.contextAfter || 2;
      
      const chapter = await quranAPI.getChapter(chapterId);
      if (!chapter) {
        return { error: 'Chapter not found' };
      }

      const startVerse = Math.max(1, verseNumber - contextBefore);
      const endVerse = Math.min(chapter.verses_count, verseNumber + contextAfter);
      
      const verses = await quranAPI.getVersesByChapter(chapterId, args.translationIds || [20], 1, chapter.verses_count);
      const contextVerses = verses.data.filter(v => {
        const [, vNum] = v.verse_key.split(':');
        const num = parseInt(vNum);
        return num >= startVerse && num <= endVerse;
      });

      return {
        targetVerse: args.verseKey,
        context: contextVerses,
        range: { start: startVerse, end: endVerse },
        chapter,
      };
    }

    case 'find_verse_by_reference': {
      const { chapterNumber, verseStart, verseEnd, translationIds } = args;
      const chapter = await quranAPI.getChapter(chapterNumber);
      if (!chapter) {
        return { error: 'Chapter not found' };
      }

      const endVerse = verseEnd || verseStart;
      if (verseStart > chapter.verses_count || endVerse > chapter.verses_count) {
        return { error: 'Verse number exceeds chapter length' };
      }

      const verses = await quranAPI.getVersesByChapter(chapterNumber, translationIds || [20], 1, chapter.verses_count);
      const requestedVerses = verses.data.filter(v => {
        const [, vNum] = v.verse_key.split(':');
        const num = parseInt(vNum);
        return num >= verseStart && num <= endVerse;
      });

      return {
        chapter,
        verses: requestedVerses,
        range: { start: verseStart, end: endVerse },
      };
    }

    case 'get_surah_navigation': {
      const { chapterId, currentVerse } = args;
      const chapter = await quranAPI.getChapter(chapterId);
      if (!chapter) {
        return { error: 'Chapter not found' };
      }

      const navigation = {
        chapter,
        totalVerses: chapter.verses_count,
        hasNext: chapterId < 114,
        hasPrevious: chapterId > 1,
        nextChapter: chapterId < 114 ? chapterId + 1 : null,
        previousChapter: chapterId > 1 ? chapterId - 1 : null,
      };

      if (currentVerse) {
        return {
          ...navigation,
          currentVerse,
          verseNavigation: {
            hasNextVerse: currentVerse < chapter.verses_count,
            hasPreviousVerse: currentVerse > 1,
            nextVerse: currentVerse < chapter.verses_count ? currentVerse + 1 : null,
            previousVerse: currentVerse > 1 ? currentVerse - 1 : null,
          },
        };
      }

      return navigation;
    }

    case 'get_page_navigation': {
      const { pageNumber } = args;
      const navigation = {
        currentPage: pageNumber,
        totalPages: 604,
        hasNext: pageNumber < 604,
        hasPrevious: pageNumber > 1,
        nextPage: pageNumber < 604 ? pageNumber + 1 : null,
        previousPage: pageNumber > 1 ? pageNumber - 1 : null,
      };

      // Get verses on this page
      const pageVerses = await quranAPI.getVersesByPage(pageNumber, [20], 1, 50);
      
      return {
        ...navigation,
        verses: pageVerses.data,
        verseCount: pageVerses.data.length,
      };
    }

    case 'get_juz_navigation': {
      const { juzNumber } = args;
      const juzMetadata = quranAPI.getJuzMetadata();
      const currentJuz = juzMetadata.find(j => j.number === juzNumber);
      
      if (!currentJuz) {
        return { error: 'Juz not found' };
      }

      const navigation = {
        currentJuz,
        totalJuzs: 30,
        hasNext: juzNumber < 30,
        hasPrevious: juzNumber > 1,
        nextJuz: juzNumber < 30 ? juzNumber + 1 : null,
        previousJuz: juzNumber > 1 ? juzNumber - 1 : null,
      };

      // Get verses in this juz
      const juzVerses = await quranAPI.getVersesByJuz(juzNumber, [20], 1, 50);
      
      return {
        ...navigation,
        verses: juzVerses.data,
        verseCount: juzVerses.data.length,
      };
    }

    case 'find_verse_location': {
      const [chapterStr, verseStr] = args.verseKey.split(':');
      const chapterId = parseInt(chapterStr);
      const verseNumber = parseInt(verseStr);
      
      const chapter = await quranAPI.getChapter(chapterId);
      if (!chapter) {
        return { error: 'Chapter not found' };
      }

      // This is a simplified approach - in a real implementation, 
      // you'd have a mapping of verses to pages and juzs
      return {
        verseKey: args.verseKey,
        chapter: {
          id: chapterId,
          name: chapter.name_simple,
          arabicName: chapter.name_arabic,
        },
        verseNumber,
        // Note: Real page/juz mapping would require additional data
        estimatedPage: Math.ceil((chapterId * verseNumber) / 10), // Simplified estimation
        estimatedJuz: Math.ceil(chapterId / 4), // Simplified estimation
      };
    }

    default:
      throw new Error(`Unknown navigation tool: ${name}`);
  }
}