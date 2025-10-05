import {
  Surah,
  RevelationType,
  getSurahEstimatedReadingTime,
  getJuzNumbers,
  getMemorizationDifficulty,
  isLongSurah,
  isMediumSurah,
  isMufassalSurah,
  isSevenLongSurah,
  isShortSurah,
} from '@/src/domain/entities';

import {
  validId,
  validName,
  validArabicName,
  validEnglishName,
  validEnglishTranslation,
  validNumberOfAyahs,
  validRevelationType,
  validRevelationOrder,
} from './Surah/test-utils';

function createSurah({
  id = validId,
  name = validName,
  arabicName = validArabicName,
  englishName = validEnglishName,
  englishTranslation = validEnglishTranslation,
  numberOfAyahs = validNumberOfAyahs,
  revelationType = validRevelationType,
  revelationOrder = validRevelationOrder,
}: {
  id?: number;
  name?: string;
  arabicName?: string;
  englishName?: string;
  englishTranslation?: string;
  numberOfAyahs?: number;
  revelationType?: RevelationType;
  revelationOrder?: number;
} = {}): Surah {
  return new Surah(
    id,
    name,
    arabicName,
    englishName,
    englishTranslation,
    numberOfAyahs,
    revelationType,
    revelationOrder
  );
}

function createMakkiSurah(): Surah {
  return createSurah({ revelationType: RevelationType.MAKKI });
}

function createMadaniSurah(): Surah {
  return createSurah({
    id: 2,
    name: 'البقرة',
    arabicName: 'البقرة',
    englishName: 'Al-Baqarah',
    englishTranslation: 'The Cow',
    numberOfAyahs: 286,
    revelationType: RevelationType.MADANI,
  });
}

function createAtTawbah(): Surah {
  return createSurah({
    id: 9,
    name: 'التوبة',
    arabicName: 'التوبة',
    englishName: 'At-Tawbah',
    englishTranslation: 'The Repentance',
    numberOfAyahs: 129,
    revelationType: RevelationType.MADANI,
  });
}

function expectPlainObject(plainObject: ReturnType<Surah['toPlainObject']>): void {
  expect(plainObject).toEqual({
    id: validId,
    name: validName,
    arabicName: validArabicName,
    englishName: validEnglishName,
    englishTranslation: validEnglishTranslation,
    numberOfAyahs: validNumberOfAyahs,
    revelationType: validRevelationType,
    revelationOrder: validRevelationOrder,
    isMakki: true,
    isMadani: false,
    canBeReadInPrayer: true,
    startWithBismillah: true,
    memorizationDifficulty: getMemorizationDifficulty(validNumberOfAyahs),
    estimatedReadingTime: getSurahEstimatedReadingTime(validNumberOfAyahs),
    isShortSurah: isShortSurah(validNumberOfAyahs),
    isMediumSurah: isMediumSurah(validNumberOfAyahs),
    isLongSurah: isLongSurah(validNumberOfAyahs),
    isSevenLongSurah: isSevenLongSurah(validId),
    isMufassalSurah: isMufassalSurah(validId),
    juzNumbers: getJuzNumbers(validId),
  });
}

describe('Surah Entity - Revelation - isMakki', () => {
  it('returns true when revelation type is MAKKI', () => {
    const makkiSurah = createMakkiSurah();
    expect(makkiSurah.isMakki()).toBe(true);
  });

  it('returns false when revelation type is MADANI', () => {
    const madaniSurah = createMadaniSurah();
    expect(madaniSurah.isMakki()).toBe(false);
  });
});
describe('Surah Entity - Revelation - isMadani', () => {
  it('returns true when revelation type is MADANI', () => {
    const madaniSurah = createMadaniSurah();
    expect(madaniSurah.isMadani()).toBe(true);
  });

  it('returns false when revelation type is MAKKI', () => {
    const makkiSurah = createMakkiSurah();
    expect(makkiSurah.isMadani()).toBe(false);
  });
});

describe('Surah Entity - Revelation - canBeReadInPrayer', () => {
  it('should return true for most Surahs', () => {
    const regularSurah = createSurah();
    expect(regularSurah.canBeReadInPrayer()).toBe(true);
  });

  it('should return false for At-Tawbah (Surah 9)', () => {
    const atTawbah = createAtTawbah();
    expect(atTawbah.canBeReadInPrayer()).toBe(false);
  });
});

describe('Surah Entity - Revelation - startWithBismillah', () => {
  it('should return true for most Surahs', () => {
    const regularSurah = createSurah();
    expect(regularSurah.startWithBismillah()).toBe(true);
  });

  it('should return false for At-Tawbah (Surah 9)', () => {
    const atTawbah = createAtTawbah();
    expect(atTawbah.startWithBismillah()).toBe(false);
  });
});

describe('Surah Entity - Revelation - equals', () => {
  it('should return true for Surahs with same ID', () => {
    const surah1 = createSurah();
    const surah2 = createSurah({
      name: 'Different Name',
      arabicName: 'اسم مختلف',
      englishName: 'Different English',
      englishTranslation: 'Different Translation',
      numberOfAyahs: 10,
      revelationType: RevelationType.MADANI,
    });
    expect(surah1.equals(surah2)).toBe(true);
  });

  it('should return false for Surahs with different IDs', () => {
    const surah1 = createSurah();
    const surah2 = createSurah({ id: 2 });
    expect(surah1.equals(surah2)).toBe(false);
  });
});

describe('Surah Entity - Revelation - toPlainObject', () => {
  it('should return plain object with all properties and computed values', () => {
    const surah = createSurah();
    const plainObject = surah.toPlainObject();
    expectPlainObject(plainObject);
  });
});
