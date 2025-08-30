import { Verse } from '../../src/domain/entities/Verse';
import { Translation } from '../../src/domain/value-objects/Translation';
import { ApiVerse } from '../../src/infrastructure/api/QuranApiClient';

/**
 * Test fixtures for Verse entities and related data
 */
export class VerseFixtures {
  /**
   * Creates a basic Verse entity for testing
   */
  static createVerse(overrides: Partial<{
    id: string;
    surahId: number;
    ayahNumber: number;
    arabicText: string;
    uthmaniText: string;
    translation?: Translation;
  }> = {}): Verse {
    const defaults = {
      id: '1:1',
      surahId: 1,
      ayahNumber: 1,
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      uthmaniText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    };

    const data = { ...defaults, ...overrides };
    
    return new Verse(
      data.id,
      data.surahId,
      data.ayahNumber,
      data.arabicText,
      data.uthmaniText,
      data.translation
    );
  }

  /**
   * Creates a Translation for testing
   */
  static createTranslation(overrides: Partial<{
    id: number;
    resourceId: number;
    text: string;
    languageCode: string;
  }> = {}): Translation {
    const defaults = {
      id: 1,
      resourceId: 131,
      text: 'In the name of Allah, the Beneficent, the Merciful.',
      languageCode: 'en',
    };

    const data = { ...defaults, ...overrides };
    
    return new Translation(data.id, data.resourceId, data.text, data.languageCode);
  }

  /**
   * Creates an API Verse response for testing
   */
  static createApiVerse(overrides: Partial<ApiVerse> = {}): ApiVerse {
    const defaults: ApiVerse = {
      id: '1:1',
      verse_number: 1,
      chapter_id: 1,
      verse_key: '1:1',
      text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      text_simple: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: {
        id: 1,
        resource_id: 131,
        text: 'In the name of Allah, the Beneficent, the Merciful.',
        language_name: 'english'
      }
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Creates Bismillah verse (1:1)
   */
  static createBismillahVerse(): Verse {
    return this.createVerse({
      id: '1:1',
      surahId: 1,
      ayahNumber: 1,
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      uthmaniText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      translation: this.createTranslation({
        text: 'In the name of Allah, the Beneficent, the Merciful.'
      })
    });
  }

  /**
   * Creates Ayatul Kursi verse (2:255)
   */
  static createAyatulKursi(): Verse {
    return this.createVerse({
      id: '2:255',
      surahId: 2,
      ayahNumber: 255,
      arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      uthmaniText: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
      translation: this.createTranslation({
        text: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.'
      })
    });
  }

  /**
   * Creates a sajdah verse (7:206)
   */
  static createSajdahVerse(): Verse {
    return this.createVerse({
      id: '7:206',
      surahId: 7,
      ayahNumber: 206,
      arabicText: 'إِنَّ الَّذِينَ عِندَ رَبِّكَ لَا يَسْتَكْبِرُونَ عَنْ عِبَادَتِهِ وَيُسَبِّحُونَهُ وَلَهُ يَسْجُدُونَ',
      uthmaniText: 'إِنَّ ٱلَّذِينَ عِندَ رَبِّكَ لَا يَسْتَكْبِرُونَ عَنْ عِبَادَتِهِۦ وَيُسَبِّحُونَهُۥ وَلَهُۥ يَسْجُدُونَ',
      translation: this.createTranslation({
        text: 'Indeed, those who are near your Lord do not disdain His worship, and they exalt Him, and to Him they prostrate.'
      })
    });
  }

  /**
   * Creates a short verse for testing
   */
  static createShortVerse(): Verse {
    return this.createVerse({
      id: '112:4',
      surahId: 112,
      ayahNumber: 4,
      arabicText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      uthmaniText: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
      translation: this.createTranslation({
        text: 'Nor is there to Him any equivalent.'
      })
    });
  }

  /**
   * Creates a long verse for testing
   */
  static createLongVerse(): Verse {
    return this.createVerse({
      id: '2:282',
      surahId: 2,
      ayahNumber: 282,
      arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ',
      uthmaniText: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰٓ أَجَلٍ مُّسَمًّى فَٱكْتُبُوهُ',
      translation: this.createTranslation({
        text: 'O you who have believed, when you contract a debt for a specified term, write it down.'
      })
    });
  }

  /**
   * Creates multiple verses for Al-Fatiha (first 3 verses)
   */
  static createAlFatihaVerses(): Verse[] {
    return [
      this.createBismillahVerse(),
      this.createVerse({
        id: '1:2',
        surahId: 1,
        ayahNumber: 2,
        arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        uthmaniText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        translation: this.createTranslation({
          text: '[All] praise is [due] to Allah, Lord of the worlds.'
        })
      }),
      this.createVerse({
        id: '1:3',
        surahId: 1,
        ayahNumber: 3,
        arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
        uthmaniText: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translation: this.createTranslation({
          text: 'The Entirely Merciful, the Especially Merciful.'
        })
      }),
    ];
  }

  /**
   * Creates verses with different translations
   */
  static createVersesWithDifferentTranslations(): Verse[] {
    const englishTranslation = this.createTranslation({
      id: 1,
      resourceId: 131,
      text: 'In the name of Allah, the Beneficent, the Merciful.',
      languageCode: 'en'
    });

    const urduTranslation = this.createTranslation({
      id: 2,
      resourceId: 158,
      text: 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
      languageCode: 'ur'
    });

    return [
      this.createVerse({ translation: englishTranslation }),
      this.createVerse({ translation: urduTranslation })
    ];
  }

  /**
   * Creates all 15 sajdah verses
   */
  static createAllSajdahVerses(): Verse[] {
    const sajdahPositions = [
      { surah: 7, ayah: 206 },
      { surah: 13, ayah: 15 },
      { surah: 16, ayah: 50 },
      { surah: 17, ayah: 109 },
      { surah: 19, ayah: 58 },
      { surah: 22, ayah: 18 },
      { surah: 22, ayah: 77 },
      { surah: 25, ayah: 60 },
      { surah: 27, ayah: 26 },
      { surah: 32, ayah: 15 },
      { surah: 38, ayah: 24 },
      { surah: 41, ayah: 38 },
      { surah: 53, ayah: 62 },
      { surah: 84, ayah: 21 },
      { surah: 96, ayah: 19 },
    ];

    return sajdahPositions.map(({ surah, ayah }) =>
      this.createVerse({
        id: `${surah}:${ayah}`,
        surahId: surah,
        ayahNumber: ayah,
        arabicText: 'سَجْدَة', // Placeholder Arabic text
        uthmaniText: 'سَجْدَة',
        translation: this.createTranslation({
          text: `Sajdah verse ${surah}:${ayah}`
        })
      })
    );
  }

  /**
   * Creates API responses for different scenarios
   */
  static createApiResponses() {
    return {
      singleVerse: { verses: [this.createApiVerse()] },
      surahVerses: { verses: this.createAlFatihaVerses().map(verse => this.createApiVerse({
        id: verse.id,
        verse_number: verse.ayahNumber,
        chapter_id: verse.surahId,
        verse_key: verse.verseKey,
        text_simple: verse.arabicText,
        text_uthmani: verse.uthmaniText
      })) },
      searchResults: { 
        search: { 
          results: [
            this.createApiVerse(),
            this.createApiVerse({ id: '2:255', verse_number: 255, chapter_id: 2, verse_key: '2:255' })
          ] 
        } 
      },
      emptyResults: { verses: [] },
      errorResponse: null
    };
  }

  /**
   * Creates test data for pagination
   */
  static createPaginatedVerses(page: number = 1, perPage: number = 10): Verse[] {
    const verses: Verse[] = [];
    const startId = (page - 1) * perPage + 1;
    
    for (let i = 0; i < perPage; i++) {
      const verseId = startId + i;
      verses.push(this.createVerse({
        id: `test:${verseId}`,
        surahId: 1,
        ayahNumber: verseId,
        arabicText: `آية رقم ${verseId}`,
        uthmaniText: `آية رقم ${verseId}`
      }));
    }
    
    return verses;
  }

  /**
   * Creates verses with different word counts for reading time testing
   */
  static createVersesWithDifferentLengths(): {
    shortVerse: Verse;
    mediumVerse: Verse;
    longVerse: Verse;
  } {
    return {
      shortVerse: this.createVerse({
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ', // 4 words
        uthmaniText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ'
      }),
      mediumVerse: this.createVerse({
        arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ', // 10 words
        uthmaniText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ مَٰلِكِ يَوْمِ ٱلدِّينِ'
      }),
      longVerse: this.createVerse({
        arabicText: Array(20).fill('كَلِمَة').join(' '), // 20 words
        uthmaniText: Array(20).fill('كَلِمَة').join(' ')
      })
    };
  }
}