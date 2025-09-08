import { Bookmark, withNotes, withTags, withAddedTag, withRemovedTag } from '@/src/domain/entities';
import { BookmarkNotFoundError, UnauthorizedBookmarkError } from '@/src/domain/errors/DomainErrors';
import { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';

/**
 * Domain service for bookmark tag and note mutations
 */
export class BookmarkMutationService {
  constructor(private bookmarkRepository: IBookmarkRepository) {}

  /**
   * Updates bookmark notes
   */
  async updateBookmarkNotes(userId: string, bookmarkId: string, notes: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (!bookmark.belongsToUser(userId)) {
      throw new UnauthorizedBookmarkError('Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = withNotes(bookmark, notes);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Updates bookmark tags
   */
  async updateBookmarkTags(userId: string, bookmarkId: string, tags: string[]): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (!bookmark.belongsToUser(userId)) {
      throw new UnauthorizedBookmarkError('Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = withTags(bookmark, tags);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Adds a tag to a bookmark
   */
  async addTagToBookmark(userId: string, bookmarkId: string, tag: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (!bookmark.belongsToUser(userId)) {
      throw new UnauthorizedBookmarkError('Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = withAddedTag(bookmark, tag);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Removes a tag from a bookmark
   */
  async removeTagFromBookmark(userId: string, bookmarkId: string, tag: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (!bookmark.belongsToUser(userId)) {
      throw new UnauthorizedBookmarkError('Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = withRemovedTag(bookmark, tag);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }
}
