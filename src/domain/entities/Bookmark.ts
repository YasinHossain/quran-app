import { BookmarkPosition } from '../value-objects/BookmarkPosition';

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
   * Checks if the bookmark has notes
   */
  hasNotes(): boolean {
    return Boolean(this.notes && this.notes.trim().length > 0);
  }

  /**
   * Checks if the bookmark has tags
   */
  hasTags(): boolean {
    return this.tags.length > 0;
  }

  /**
   * Checks if the bookmark contains a specific tag
   */
  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  /**
   * Creates a new bookmark with updated notes
   */
  withNotes(notes: string): Bookmark {
    return new Bookmark(
      this.id,
      this.userId,
      this.verseId,
      this.position,
      this.createdAt,
      notes,
      this.tags
    );
  }

  /**
   * Creates a new bookmark with updated tags
   */
  withTags(tags: string[]): Bookmark {
    return new Bookmark(
      this.id,
      this.userId,
      this.verseId,
      this.position,
      this.createdAt,
      this.notes,
      tags
    );
  }

  /**
   * Creates a new bookmark with an added tag
   */
  withAddedTag(tag: string): Bookmark {
    const newTags = [...this.tags];
    if (!newTags.includes(tag)) {
      newTags.push(tag);
    }
    return this.withTags(newTags);
  }

  /**
   * Creates a new bookmark with a removed tag
   */
  withRemovedTag(tag: string): Bookmark {
    return this.withTags(this.tags.filter((t) => t !== tag));
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
    if (this.hasNotes()) {
      text += ` - ${this.notes}`;
    }
    if (this.hasTags()) {
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
    return {
      id: this.id,
      userId: this.userId,
      verseId: this.verseId,
      position: this.position.toPlainObject(),
      createdAt: this.createdAt.toISOString(),
      notes: this.notes,
      tags: this.tags,
      hasNotes: this.hasNotes(),
      hasTags: this.hasTags(),
      displayText: this.getDisplayText(),
    };
  }
}
