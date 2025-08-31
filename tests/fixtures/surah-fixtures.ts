import { Surah, RevelationType } from '../../src/domain/entities/Surah';
import { ApiSurah } from '../../src/infrastructure/api/QuranApiClient';

/**
 * Test fixtures for Surah entities and related data
 */
export class SurahFixtures {
  /**
   * Creates a basic Surah entity for testing
   */
  static createSurah(
    overrides: Partial<{
      id: number;
      name: string;
      arabicName: string;
      englishName: string;
      englishTranslation: string;
      numberOfAyahs: number;
      revelationType: RevelationType;
      revelationOrder?: number;
    }> = {}
  ): Surah {
    const defaults = {
      id: 1,
      name: 'Al-Fatiha',
      arabicName: 'الفاتحة',
      englishName: 'The Opening',
      englishTranslation: 'The Opening',
      numberOfAyahs: 7,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 5,
    };

    const data = { ...defaults, ...overrides };

    return new Surah(
      data.id,
      data.name,
      data.arabicName,
      data.englishName,
      data.englishTranslation,
      data.numberOfAyahs,
      data.revelationType,
      data.revelationOrder
    );
  }

  /**
   * Creates an API Surah response for testing
   */
  static createApiSurah(overrides: Partial<ApiSurah> = {}): ApiSurah {
    const defaults: ApiSurah = {
      id: 1,
      name_simple: 'Al-Fatiha',
      name_complex: 'Al-Fātiḥah',
      name_arabic: 'الفاتحة',
      verses_count: 7,
      revelation_place: 'makkah' as const,
      revelation_order: 5,
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Creates Al-Fatiha (first surah)
   */
  static createAlFatiha(): Surah {
    return this.createSurah({
      id: 1,
      name: 'Al-Fatiha',
      arabicName: 'الفاتحة',
      englishName: 'The Opening',
      englishTranslation: 'The Opening',
      numberOfAyahs: 7,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 5,
    });
  }

  /**
   * Creates Al-Baqarah (second surah - longest surah)
   */
  static createAlBaqarah(): Surah {
    return this.createSurah({
      id: 2,
      name: 'Al-Baqarah',
      arabicName: 'البقرة',
      englishName: 'The Cow',
      englishTranslation: 'The Cow',
      numberOfAyahs: 286,
      revelationType: RevelationType.MADANI,
      revelationOrder: 87,
    });
  }

  /**
   * Creates At-Tawbah (surah 9 - no Bismillah)
   */
  static createAtTawbah(): Surah {
    return this.createSurah({
      id: 9,
      name: 'At-Tawbah',
      arabicName: 'التوبة',
      englishName: 'The Repentance',
      englishTranslation: 'The Repentance',
      numberOfAyahs: 129,
      revelationType: RevelationType.MADANI,
      revelationOrder: 113,
    });
  }

  /**
   * Creates Al-Kawthar (shortest surah)
   */
  static createAlKawthar(): Surah {
    return this.createSurah({
      id: 108,
      name: 'Al-Kawthar',
      arabicName: 'الكوثر',
      englishName: 'The Abundance',
      englishTranslation: 'The Abundance',
      numberOfAyahs: 3,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 15,
    });
  }

  /**
   * Creates An-Nas (last surah)
   */
  static createAnNas(): Surah {
    return this.createSurah({
      id: 114,
      name: 'An-Nas',
      arabicName: 'الناس',
      englishName: 'The People',
      englishTranslation: 'The People',
      numberOfAyahs: 6,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 21,
    });
  }

  /**
   * Creates Yaseen (Surah 36)
   */
  static createYaseen(): Surah {
    return this.createSurah({
      id: 36,
      name: 'Yaseen',
      arabicName: 'يس',
      englishName: 'Ya-Sin',
      englishTranslation: 'Ya-Sin',
      numberOfAyahs: 83,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 41,
    });
  }

  /**
   * Creates Al-Kahf (Surah 18 - Friday reading)
   */
  static createAlKahf(): Surah {
    return this.createSurah({
      id: 18,
      name: 'Al-Kahf',
      arabicName: 'الكهف',
      englishName: 'The Cave',
      englishTranslation: 'The Cave',
      numberOfAyahs: 110,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 69,
    });
  }

  /**
   * Creates Al-Mulk (Surah 67)
   */
  static createAlMulk(): Surah {
    return this.createSurah({
      id: 67,
      name: 'Al-Mulk',
      arabicName: 'الملك',
      englishName: 'The Kingdom',
      englishTranslation: 'The Kingdom',
      numberOfAyahs: 30,
      revelationType: RevelationType.MAKKI,
      revelationOrder: 77,
    });
  }

  /**
   * Creates collection of Makki surahs
   */
  static createMakkiSurahs(): Surah[] {
    return [
      this.createAlFatiha(),
      this.createAlKawthar(),
      this.createAnNas(),
      this.createYaseen(),
      this.createAlKahf(),
      this.createAlMulk(),
    ];
  }

  /**
   * Creates collection of Madani surahs
   */
  static createMadaniSurahs(): Surah[] {
    return [
      this.createAlBaqarah(),
      this.createAtTawbah(),
      this.createSurah({
        id: 3,
        name: 'Ali Imran',
        arabicName: 'آل عمران',
        englishName: 'The Family of Imran',
        englishTranslation: 'The Family of Imran',
        numberOfAyahs: 200,
        revelationType: RevelationType.MADANI,
        revelationOrder: 89,
      }),
    ];
  }

  /**
   * Creates the Seven Long Surahs (As-Sab' at-Tiwal)
   */
  static createSevenLongSurahs(): Surah[] {
    return [
      this.createAlBaqarah(), // 2
      this.createSurah({
        // 3 - Ali Imran
        id: 3,
        name: 'Ali Imran',
        arabicName: 'آل عمران',
        englishName: 'The Family of Imran',
        englishTranslation: 'The Family of Imran',
        numberOfAyahs: 200,
        revelationType: RevelationType.MADANI,
      }),
      this.createSurah({
        // 4 - An-Nisa
        id: 4,
        name: 'An-Nisa',
        arabicName: 'النساء',
        englishName: 'The Women',
        englishTranslation: 'The Women',
        numberOfAyahs: 176,
        revelationType: RevelationType.MADANI,
      }),
      this.createSurah({
        // 5 - Al-Maidah
        id: 5,
        name: 'Al-Maidah',
        arabicName: 'المائدة',
        englishName: 'The Table',
        englishTranslation: 'The Table',
        numberOfAyahs: 120,
        revelationType: RevelationType.MADANI,
      }),
      this.createSurah({
        // 6 - Al-Anam
        id: 6,
        name: 'Al-Anam',
        arabicName: 'الأنعام',
        englishName: 'The Cattle',
        englishTranslation: 'The Cattle',
        numberOfAyahs: 165,
        revelationType: RevelationType.MAKKI,
      }),
      this.createSurah({
        // 7 - Al-Araf
        id: 7,
        name: 'Al-Araf',
        arabicName: 'الأعراف',
        englishName: 'The Heights',
        englishTranslation: 'The Heights',
        numberOfAyahs: 206,
        revelationType: RevelationType.MAKKI,
      }),
      this.createAtTawbah(), // 9 - At-Tawbah (note: skips 8)
    ];
  }

  /**
   * Creates surahs with different lengths for testing
   */
  static createSurahsWithDifferentLengths(): {
    shortSurah: Surah;
    mediumSurah: Surah;
    longSurah: Surah;
  } {
    return {
      shortSurah: this.createAlKawthar(), // 3 verses
      mediumSurah: this.createAlMulk(), // 30 verses
      longSurah: this.createAlBaqarah(), // 286 verses
    };
  }

  /**
   * Creates surahs for memorization difficulty testing
   */
  static createSurahsForMemorizationTesting(): {
    easy: Surah[];
    medium: Surah[];
    hard: Surah[];
  } {
    return {
      easy: [
        // <= 10 verses
        this.createAlFatiha(), // 7 verses
        this.createAlKawthar(), // 3 verses
        this.createAnNas(), // 6 verses
      ],
      medium: [
        // 11-50 verses
        this.createAlMulk(), // 30 verses
        this.createSurah({
          id: 112,
          name: 'Al-Ikhlas',
          arabicName: 'الإخلاص',
          englishName: 'The Sincerity',
          englishTranslation: 'The Sincerity',
          numberOfAyahs: 4,
          revelationType: RevelationType.MAKKI,
        }),
      ],
      hard: [
        // > 50 verses
        this.createAlBaqarah(), // 286 verses
        this.createAlKahf(), // 110 verses
        this.createYaseen(), // 83 verses
      ],
    };
  }

  /**
   * Creates Mufassal surahs (from 49 onwards)
   */
  static createMufassalSurahs(): Surah[] {
    return [
      this.createSurah({
        id: 49,
        name: 'Al-Hujurat',
        arabicName: 'الحجرات',
        englishName: 'The Chambers',
        englishTranslation: 'The Chambers',
        numberOfAyahs: 18,
        revelationType: RevelationType.MADANI,
      }),
      this.createSurah({
        id: 50,
        name: 'Qaf',
        arabicName: 'ق',
        englishName: 'Qaf',
        englishTranslation: 'Qaf',
        numberOfAyahs: 45,
        revelationType: RevelationType.MAKKI,
      }),
      // ... would continue with more Mufassal surahs
      this.createAnNas(), // 114
    ];
  }

  /**
   * Creates API responses for different scenarios
   */
  static createApiResponses() {
    return {
      singleSurah: { chapter: this.createApiSurah() },
      allSurahs: {
        chapters: [
          this.createApiSurah(),
          this.createApiSurah({
            id: 2,
            name_simple: 'Al-Baqarah',
            name_arabic: 'البقرة',
            verses_count: 286,
          }),
          this.createApiSurah({
            id: 114,
            name_simple: 'An-Nas',
            name_arabic: 'الناس',
            verses_count: 6,
          }),
        ],
      },
      makkiSurahs: {
        chapters: this.createMakkiSurahs().map((surah) =>
          this.createApiSurah({
            id: surah.id,
            name_simple: surah.englishName,
            name_arabic: surah.arabicName,
            verses_count: surah.numberOfAyahs,
            revelation_place: 'makkah',
          })
        ),
      },
      madaniSurahs: {
        chapters: this.createMadaniSurahs().map((surah) =>
          this.createApiSurah({
            id: surah.id,
            name_simple: surah.englishName,
            name_arabic: surah.arabicName,
            verses_count: surah.numberOfAyahs,
            revelation_place: 'madinah',
          })
        ),
      },
      errorResponse: null,
    };
  }

  /**
   * Creates test data for Juz mappings
   */
  static createJuzMappings(): Record<number, number[]> {
    return {
      1: [1], // Al-Fatiha in Juz 1
      2: [1, 2, 3], // Al-Baqarah spans Juz 1, 2, 3
      3: [3, 4], // Ali Imran spans Juz 3, 4
      18: [15, 16], // Al-Kahf spans Juz 15, 16
      36: [22, 23], // Yaseen spans Juz 22, 23
      67: [29], // Al-Mulk in Juz 29
      114: [30], // An-Nas in Juz 30
    };
  }

  /**
   * Creates surahs with specific revelation orders for testing
   */
  static createSurahsByRevelationOrder(): Surah[] {
    return [
      // First 5 revealed surahs
      this.createSurah({
        id: 96,
        name: 'Al-Alaq',
        arabicName: 'العلق',
        englishName: 'The Clot',
        englishTranslation: 'The Clot',
        numberOfAyahs: 19,
        revelationType: RevelationType.MAKKI,
        revelationOrder: 1, // First revealed
      }),
      this.createSurah({
        id: 68,
        name: 'Al-Qalam',
        arabicName: 'القلم',
        englishName: 'The Pen',
        englishTranslation: 'The Pen',
        numberOfAyahs: 52,
        revelationType: RevelationType.MAKKI,
        revelationOrder: 2,
      }),
      this.createSurah({
        id: 73,
        name: 'Al-Muzzammil',
        arabicName: 'المزمل',
        englishName: 'The Wrapped',
        englishTranslation: 'The Wrapped',
        numberOfAyahs: 20,
        revelationType: RevelationType.MAKKI,
        revelationOrder: 3,
      }),
      this.createSurah({
        id: 74,
        name: 'Al-Muddathir',
        arabicName: 'المدثر',
        englishName: 'The Covered',
        englishTranslation: 'The Covered',
        numberOfAyahs: 56,
        revelationType: RevelationType.MAKKI,
        revelationOrder: 4,
      }),
      this.createAlFatiha(), // 5th revealed
    ];
  }

  /**
   * Creates paginated surahs for testing
   */
  static createPaginatedSurahs(page: number = 1, perPage: number = 10): Surah[] {
    const allSurahs = [];
    for (let i = 1; i <= 114; i++) {
      allSurahs.push(
        this.createSurah({
          id: i,
          name: `Surah ${i}`,
          arabicName: `السورة ${i}`,
          englishName: `Surah ${i}`,
          englishTranslation: `The ${i}`,
          numberOfAyahs: Math.floor(Math.random() * 200) + 1,
          revelationType: i % 2 === 0 ? RevelationType.MADANI : RevelationType.MAKKI,
        })
      );
    }

    const startIndex = (page - 1) * perPage;
    return allSurahs.slice(startIndex, startIndex + perPage);
  }
}
