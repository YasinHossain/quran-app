import { BookmarkPosition } from '../value-objects/BookmarkPosition';

/**
 * Core domain entity representing a bookmarked verse.
 * Contains business logic and invariants for bookmark operations.
 */
export class Bookmark {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _verseId: string,
    private readonly _position: BookmarkPosition,
    private readonly _createdAt: Date,
    private readonly _notes?: string,
    private readonly _tags?: string[]
  ) {
    if (!_id?.trim()) throw new Error('Bookmark ID cannot be empty');
    if (!_userId?.trim()) throw new Error('User ID cannot be empty');
    if (!_verseId?.trim()) throw new Error('Verse ID cannot be empty');
    if (!_position) throw new Error('Bookmark position is required');
    if (!_createdAt) throw new Error('Creation date is required');
    if (_tags && !Array.isArray(_tags)) throw new Error('Tags must be an array');
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get verseId(): string {
    return this._verseId;
  }
  get position(): BookmarkPosition {
    return this._position;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get notes(): string | undefined {
    return this._notes;
  }
  get tags(): string[] | undefined {
    return this._tags;
  }

  // Business Logic Methods

  /**
   * Checks if this bookmark has notes
   */
  hasNotes(): boolean {
    return Boolean(this._notes?.trim());
  }

  /**
   * Checks if this bookmark has tags
   */
  hasTags(): boolean {
    return Boolean(this._tags && this._tags.length > 0);
  }

  /**
   * Checks if this bookmark contains a specific tag
   */
  hasTag(tag: string): boolean {
    if (!this._tags) return false;
    return this._tags.includes(tag.toLowerCase().trim());
  }

  /**
   * Gets the age of this bookmark in days
   */
  getAgeInDays(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this._createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Checks if this bookmark was created within the last N days
   */
  isRecentlyCreated(days: number = 7): boolean {
    return this.getAgeInDays() <= days;
  }

  /**
   * Checks if this bookmark is for a specific Surah
   */
  isForSurah(surahId: number): boolean {
    return this._position.surahId === surahId;
  }

  /**
   * Checks if this bookmark is for a specific verse
   */
  isForVerse(surahId: number, ayahNumber: number): boolean {
    return this._position.surahId === surahId && this._position.ayahNumber === ayahNumber;
  }

  /**
   * Gets a display-friendly description of this bookmark
   */
  getDisplayDescription(): string {
    const surahName = this.getSurahDisplayName();
    return `${surahName} - Verse ${this._position.ayahNumber}`;
  }

  /**
   * Gets the Surah display name (this would typically come from a Surah repository)
   * For now, returns a placeholder
   */
  private getSurahDisplayName(): string {
    // This would typically lookup the Surah name from a repository
    // For now, return a simple format
    return `Surah ${this._position.surahId}`;
  }

  /**
   * Creates a copy with additional notes
   */
  withNotes(notes: string): Bookmark {
    return new Bookmark(
      this._id,
      this._userId,
      this._verseId,
      this._position,
      this._createdAt,
      notes,
      this._tags
    );
  }

  /**
   * Creates a copy with additional tags
   */
  withTags(tags: string[]): Bookmark {
    const uniqueSet = new Set(tags.map((tag) => tag.toLowerCase().trim()));
    const uniqueTags = Array.from(uniqueSet);
    return new Bookmark(
      this._id,
      this._userId,
      this._verseId,
      this._position,
      this._createdAt,
      this._notes,
      uniqueTags
    );
  }

  /**
   * Creates a copy with an additional tag
   */
  addTag(tag: string): Bookmark {
    const normalizedTag = tag.toLowerCase().trim();
    if (!normalizedTag) return this;

    const existingTags = this._tags || [];
    if (existingTags.includes(normalizedTag)) return this;

    return this.withTags([...existingTags, normalizedTag]);
  }

  /**
   * Creates a copy without a specific tag
   */
  removeTag(tag: string): Bookmark {
    if (!this._tags) return this;

    const normalizedTag = tag.toLowerCase().trim();
    const filteredTags = this._tags.filter((t) => t !== normalizedTag);

    return this.withTags(filteredTags);
  }

  /**
   * Checks equality with another bookmark
   */
  equals(other: Bookmark): boolean {
    return this._id === other._id;
  }

  /**
   * Compares positions with another bookmark
   */
  isSamePosition(other: Bookmark): boolean {
    return this._position.equals(other._position);
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      id: this._id,
      userId: this._userId,
      verseId: this._verseId,
      position: this._position.toPlainObject(),
      createdAt: this._createdAt.toISOString(),
      notes: this._notes,
      tags: this._tags,
      hasNotes: this.hasNotes(),
      hasTags: this.hasTags(),
      ageInDays: this.getAgeInDays(),
      isRecentlyCreated: this.isRecentlyCreated(),
      displayDescription: this.getDisplayDescription(),
    };
  }
}
