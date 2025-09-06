import { Bookmark } from '../entities/Bookmark';
import { BookmarkNotFoundError, UnauthorizedBookmarkError } from '../errors/DomainErrors';
import { IBookmarkRepository } from '../repositories/IBookmarkRepository';

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

    const updatedBookmark = bookmark.withNotes(notes);
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

    const updatedBookmark = bookmark.withTags(tags);
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

    const updatedBookmark = bookmark.withAddedTag(tag);
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

    const updatedBookmark = bookmark.withRemovedTag(tag);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }
}
