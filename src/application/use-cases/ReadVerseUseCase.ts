import { injectable, inject } from 'inversify';
import { TYPES } from '../../shared/config/container';
import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { Verse } from '../../domain/entities/Verse';

export interface ReadVerseParams {
  surahId: number;
  ayahNumber: number;
  translationId?: string;
}

export interface ReadVerseResult {
  verse: Verse;
  estimatedReadingTime: number;
}

// // @injectable()
export class ReadVerseUseCase {
  constructor() // @inject(TYPES.IVerseRepository) private verseRepository: IVerseRepository
  {}

  async execute(params: ReadVerseParams): Promise<ReadVerseResult> {
    const verse = await this.verseRepository.findBySurahAndAyah(params.surahId, params.ayahNumber);

    if (!verse) {
      throw new Error(`Verse not found: ${params.surahId}:${params.ayahNumber}`);
    }

    // Calculate estimated reading time (simple implementation)
    const arabicText = verse.getArabicText();
    const wordCount = arabicText.split(' ').length;
    const wordsPerMinute = 120; // Average reading speed for Arabic
    const estimatedReadingTime = Math.ceil((wordCount / wordsPerMinute) * 60); // in seconds

    return {
      verse,
      estimatedReadingTime,
    };
  }
}
