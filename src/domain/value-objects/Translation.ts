/**
 * Value object representing a translation of a verse.
 * Immutable and contains translation-specific business logic.
 */
export class Translation {
  constructor(
    private readonly _id: number,
    private readonly _resourceId: number,
    private readonly _text: string,
    private readonly _languageCode: string = 'en'
  ) {
    if (_id < 0) throw new Error('Translation ID must be non-negative');
    if (_resourceId < 0) throw new Error('Resource ID must be non-negative');
    if (!_text?.trim()) throw new Error('Translation text cannot be empty');
    if (!_languageCode?.trim()) throw new Error('Language code cannot be empty');
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get resourceId(): number {
    return this._resourceId;
  }
  get text(): string {
    return this._text;
  }
  get languageCode(): string {
    return this._languageCode;
  }

  // Business Logic Methods

  /**
   * Gets the word count of the translation
   */
  getWordCount(): number {
    return this._text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Gets the character count of the translation
   */
  getCharacterCount(): number {
    return this._text.length;
  }

  /**
   * Checks if the translation is in English
   */
  isEnglish(): boolean {
    return this._languageCode.toLowerCase().startsWith('en');
  }

  /**
   * Checks if the translation contains specific text (case-insensitive)
   */
  contains(searchText: string): boolean {
    return this._text.toLowerCase().includes(searchText.toLowerCase());
  }

  /**
   * Gets a preview of the translation (first N words)
   */
  getPreview(wordLimit: number = 10): string {
    const words = this._text.trim().split(/\s+/);
    if (words.length <= wordLimit) return this._text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }

  /**
   * Checks if this is a long translation (more than 50 words)
   */
  isLong(): boolean {
    return this.getWordCount() > 50;
  }

  /**
   * Checks equality with another translation
   */
  equals(other: Translation): boolean {
    return this._id === other._id && this._resourceId === other._resourceId;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      id: this._id,
      resourceId: this._resourceId,
      text: this._text,
      languageCode: this._languageCode,
      wordCount: this.getWordCount(),
      characterCount: this.getCharacterCount(),
      isEnglish: this.isEnglish(),
      isLong: this.isLong(),
      preview: this.getPreview(),
    };
  }
}
