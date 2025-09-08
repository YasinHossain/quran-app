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
  public readonly notes?: string;
  public readonly tags: string[];

  // Overload signatures to support both options object and legacy args
  constructor(init: BookmarkInit);
  constructor(
    id: string,
    userId: string,
    verseId: string,
    position: BookmarkPosition,
    createdAt: Date,
    notes?: string,
    tags?: string[]
  );
  constructor(...args: unknown[]) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      const { id, userId, verseId, position, createdAt, notes, tags } = args[0] as BookmarkInit;
      this.id = id;
      this.userId = userId;
      this.verseId = verseId;
      this.position = position;
      this.createdAt = createdAt;
      this.notes = notes;
      this.tags = tags ?? [];
    } else {
      const [id, userId, verseId, position, createdAt, notes, tags] = args as [
        string,
        string,
        string,
        BookmarkPosition,
        Date,
        string?,
        string[]?,
      ];
      this.id = id;
      this.userId = userId;
      this.verseId = verseId;
      this.position = position;
      this.createdAt = createdAt;
      this.notes = notes;
      this.tags = tags ?? [];
    }
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
      notes: this.notes,
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
