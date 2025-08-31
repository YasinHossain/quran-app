import { injectable, inject } from 'inversify';
import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { Bookmark } from '../../domain/entities/Bookmark';
import { ICache } from '../../domain/repositories/ICache';

// // @injectable()
export class BookmarkRepository implements IBookmarkRepository {
  private readonly CACHE_KEY = 'bookmarks';

  constructor(private cache: ICache) {}

  async save(bookmark: Bookmark): Promise<void> {
    const bookmarks = await this.findAll();
    const existingIndex = bookmarks.findIndex((b) => b.getId() === bookmark.getId());

    if (existingIndex >= 0) {
      bookmarks[existingIndex] = bookmark;
    } else {
      bookmarks.push(bookmark);
    }

    await this.cache.set(
      this.CACHE_KEY,
      bookmarks.map((b) => this.mapToStorage(b)),
      86400
    );
  }

  async remove(id: string): Promise<void> {
    const bookmarks = await this.findAll();
    const filteredBookmarks = bookmarks.filter((b) => b.getId() !== id);
    await this.cache.set(
      this.CACHE_KEY,
      filteredBookmarks.map((b) => this.mapToStorage(b)),
      86400
    );
  }

  async findByUser(userId: string): Promise<Bookmark[]> {
    const bookmarks = await this.findAll();
    return bookmarks.filter((b) => b.getUserId() === userId);
  }

  async findRecent(userId: string, limit: number): Promise<Bookmark[]> {
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime())
      .slice(0, limit);
  }

  async exists(userId: string, verseId: string): Promise<boolean> {
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks.some((b) => b.getVerseId() === verseId);
  }

  async findById(id: string): Promise<Bookmark | null> {
    const bookmarks = await this.findAll();
    return bookmarks.find((b) => b.getId() === id) || null;
  }

  private async findAll(): Promise<Bookmark[]> {
    const cached = await this.cache.get<any[]>(this.CACHE_KEY);
    if (cached) {
      return cached.map((data) => this.mapToEntity(data));
    }
    return [];
  }

  private mapToEntity(data: any): Bookmark {
    return new Bookmark(
      data.id,
      data.userId,
      data.verseId,
      data.surahId,
      data.ayahNumber,
      data.note || undefined,
      data.tags || [],
      new Date(data.createdAt)
    );
  }

  private mapToStorage(bookmark: Bookmark): any {
    return {
      id: bookmark.getId(),
      userId: bookmark.getUserId(),
      verseId: bookmark.getVerseId(),
      surahId: bookmark.getSurahId(),
      ayahNumber: bookmark.getAyahNumber(),
      note: bookmark.getNote(),
      tags: bookmark.getTags(),
      createdAt: bookmark.getCreatedAt().toISOString(),
    };
  }
}
