/**
 * Translation value object for verse translations
 */
export interface TranslationOptions {
  id: number;
  resourceId: number;
  text: string;
  languageCode?: string;
}

export class Translation {
  public readonly id: number;
  public readonly resourceId: number;
  public readonly text: string;
  public readonly languageCode: string;

  constructor({ id, resourceId, text, languageCode = 'en' }: TranslationOptions) {
    this.id = id;
    this.resourceId = resourceId;
    this.text = text;
    this.languageCode = languageCode;
    this.validateInputs();
  }

  private validateInputs(): void {
    if (this.id < 0) {
      throw new Error('Translation ID must be non-negative');
    }

    if (this.resourceId < 0) {
      throw new Error('Resource ID must be non-negative');
    }

    if (!this.text || this.text.trim() === '') {
      throw new Error('Translation text cannot be empty');
    }

    if (!this.languageCode || this.languageCode.trim() === '') {
      throw new Error('Language code cannot be empty');
    }
  }

  /**
   * Gets the word count of the translation text
   */
  getWordCount(): number {
    return this.text.split(/\s+/).filter((word) => word.trim().length > 0).length;
  }

  /**
   * Gets the character count including spaces
   */
  getCharacterCount(): number {
    return this.text.length;
  }

  /**
   * Checks if this is an English translation
   */
  isEnglish(): boolean {
    return this.languageCode.toLowerCase().startsWith('en');
  }

  /**
   * Checks if the translation contains a specific text (case-insensitive)
   */
  contains(searchText: string): boolean {
    if (!searchText) return true;
    return this.text.toLowerCase().includes(searchText.toLowerCase());
  }

  /**
   * Gets a preview of the translation with word limit
   */
  getPreview(wordLimit: number = 10): string {
    const words = this.text.split(/\s+/);
    if (words.length <= wordLimit) {
      return this.text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  /**
   * Checks if this is a long translation (more than 50 words)
   */
  isLong(): boolean {
    return this.getWordCount() > 50;
  }

  /**
   * Checks equality based on ID and resource ID
   */
  equals(other: Translation): boolean {
    return this.id === other.id && this.resourceId === other.resourceId;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject(): TranslationPlainObject {
    return {
      id: this.id,
      resourceId: this.resourceId,
      text: this.text,
      languageCode: this.languageCode,
      wordCount: this.getWordCount(),
      characterCount: this.getCharacterCount(),
      isEnglish: this.isEnglish(),
      isLong: this.isLong(),
      preview: this.getPreview(),
    };
  }
}

export interface TranslationPlainObject {
  id: number;
  resourceId: number;
  text: string;
  languageCode: string;
  wordCount: number;
  characterCount: number;
  isEnglish: boolean;
  isLong: boolean;
  preview: string;
}
