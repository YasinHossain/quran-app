import {
  BookmarkPosition,
  BookmarkPositionPlainObject,
} from '@/src/domain/value-objects/BookmarkPosition';

/**
 * Bookmark domain entity representing a bookmarked verse
 */
export interface BookmarkInit {
  id: string;
  userId: string;
  verseId: string;
  position: BookmarkPosition;
  createdAt: Date;
  notes?: string;
  tags?: string[];
}

export class Bookmark {
  public readonly id: string;
  public readonly userId: string;
  public readonly verseId: string;
  public readonly position: BookmarkPosition;
  public readonly createdAt: Date;
  public readonly notes: string | undefined;
  public readonly tags: string[];
  constructor(init: BookmarkInit) {
    this.id = init.id;
    this.userId = init.userId;
    this.verseId = init.verseId;
    this.position = init.position;
    this.createdAt = init.createdAt;
    this.notes = init.notes;
    this.tags = init.tags ?? [];
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
  toPlainObject(): BookmarkPlainObject {
    const hasNotes = Boolean(this.notes && this.notes.trim().length > 0);
    const hasTags = this.tags.length > 0;
    return {
      id: this.id,
      userId: this.userId,
      verseId: this.verseId,
      position: this.position.toPlainObject(),
      createdAt: this.createdAt.toISOString(),
      ...(this.notes ? { notes: this.notes } : {}),
      tags: this.tags,
      hasNotes,
      hasTags,
      displayText: this.getDisplayText(),
    };
  }
}

export interface BookmarkPlainObject {
  id: string;
  userId: string;
  verseId: string;
  position: BookmarkPositionPlainObject;
  createdAt: string;
  notes?: string;
  tags: string[];
  hasNotes: boolean;
  hasTags: boolean;
  displayText: string;
}
