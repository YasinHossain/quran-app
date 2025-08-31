import { injectable, inject } from 'inversify';
import { TYPES } from '../../shared/config/container';
import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { Bookmark } from '../../domain/entities/Bookmark';

export interface BookmarkVerseParams {
  userId: string;
  surahId: number;
  ayahNumber: number;
  note?: string;
  tags?: string[];
}

export interface BookmarkVerseResult {
  bookmark: Bookmark;
  success: boolean;
}

// // @injectable()
export class BookmarkVerseUseCase {
  constructor() // @inject(TYPES.IBookmarkRepository) private bookmarkRepository: IBookmarkRepository,
  // @inject(TYPES.IVerseRepository) private verseRepository: IVerseRepository
  {}

  async execute(params: BookmarkVerseParams): Promise<BookmarkVerseResult> {
    // Verify verse exists
    const verse = await this.verseRepository.findBySurahAndAyah(params.surahId, params.ayahNumber);

    if (!verse) {
      throw new Error(`Verse not found: ${params.surahId}:${params.ayahNumber}`);
    }

    // Check if bookmark already exists
    const verseId = verse.getId();
    const exists = await this.bookmarkRepository.exists(params.userId, verseId);

    if (exists) {
      throw new Error('Verse is already bookmarked');
    }

    // Create bookmark
    const bookmarkId = this.generateBookmarkId();
    const bookmark = new Bookmark(
      bookmarkId,
      params.userId,
      verseId,
      params.surahId,
      params.ayahNumber,
      params.note,
      params.tags || [],
      new Date()
    );

    // Save bookmark
    await this.bookmarkRepository.save(bookmark);

    return {
      bookmark,
      success: true,
    };
  }

  private generateBookmarkId(): string {
    return `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
