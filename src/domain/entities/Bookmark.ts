import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

/**
 * Bookmark domain entity representing a bookmarked verse
 */
export class Bookmark {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly verseId: string,
    public readonly position: BookmarkPosition,
    public readonly createdAt: Date,
    public readonly notes?: string,
    public readonly tags: string[] = []
  ) {
    this.validateInputs();
  }

  private validateInputs(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Bookmark ID cannot be empty');
    }

    if (!this.userId || this.userId.trim() === '') {
      throw new Error('User ID cannot be empty');
    }

    if (!this.verseId || this.verseId.trim() === '') {
      throw new Error('Verse ID cannot be empty');
    }

    if (!this.createdAt) {
      throw new Error('Created date is required');
    }
  }

  /**
   * Checks if bookmark belongs to a specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Gets display text for the bookmark
   */
  getDisplayText(): string {
    let text = this.position.getDisplayText();
    if (this.notes && this.notes.trim().length > 0) {
      text += ` - ${this.notes}`;
    }
    if (this.tags.length > 0) {
      text += ` [${this.tags.join(', ')}]`;
    }
    return text;
  }

  /**
   * Checks equality based on ID
   */
  equals(other: Bookmark): boolean {
    return this.id === other.id;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    const hasNotes = Boolean(this.notes && this.notes.trim().length > 0);
    const hasTags = this.tags.length > 0;
    return {
      id: this.id,
      userId: this.userId,
      verseId: this.verseId,
      position: this.position.toPlainObject(),
      createdAt: this.createdAt.toISOString(),
      notes: this.notes,
      tags: this.tags,
      hasNotes,
      hasTags,
      displayText: this.getDisplayText(),
    };
  }
}
