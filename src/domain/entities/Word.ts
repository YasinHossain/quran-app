/**
 * Domain Entity: Word
 * 
 * Represents an individual word in a Quranic verse with translation information.
 * Focused on current application needs.
 */

export interface WordTranslation {
  language: string;
  text: string;
}

export class Word {
  private constructor(
    public readonly id: number,
    public readonly position: number,
    public readonly uthmani: string,
    public readonly simple?: string,
    public readonly translation?: WordTranslation,
    public readonly audioUrl?: string
  ) {}

  /**
   * Factory method to create word from API data
   */
  static fromApiData(data: {
    id: number;
    position?: number;
    text_uthmani?: string;
    text?: string;
    translation?: { text?: string; language?: string };
    audio_url?: string;
  }): Word {
    const translation = data.translation?.text ? {
      language: data.translation.language || 'en',
      text: data.translation.text
    } : undefined;

    return new Word(
      data.id,
      data.position || 0,
      data.text_uthmani || data.text || '',
      data.text,
      translation,
      data.audio_url
    );
  }

  /**
   * Create word with full data
   */
  static create(
    id: number,
    position: number,
    uthmani: string,
    simple?: string,
    translation?: WordTranslation,
    audioUrl?: string
  ): Word {
    return new Word(id, position, uthmani, simple, translation, audioUrl);
  }

  /**
   * Get the Arabic text (preferring Uthmani script)
   */
  getArabicText(): string {
    return this.uthmani || this.simple || '';
  }

  /**
   * Get the simplified Arabic text (without diacritics)
   */
  getSimpleText(): string {
    if (this.simple) return this.simple;
    // Remove diacritics from Uthmani text as fallback
    return this.uthmani.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
  }

  /**
   * Get translation text
   */
  getTranslation(language: string = 'en'): string | null {
    return this.translation?.language === language ? this.translation.text : null;
  }

  /**
   * Check if word has translation
   */
  hasTranslation(): boolean {
    return !!(this.translation?.text);
  }

  /**
   * Check if word has audio
   */
  hasAudio(): boolean {
    return !!(this.audioUrl);
  }


  /**
   * Add or update translation (returns new instance - immutable)
   */
  withTranslation(translation: WordTranslation): Word {
    return new Word(
      this.id,
      this.position,
      this.uthmani,
      this.simple,
      translation,
      this.audioUrl
    );
  }

  /**
   * Get word length in characters
   */
  getLength(): number {
    return this.getArabicText().length;
  }

  /**
   * Check if word contains specific Arabic letters
   */
  containsLetters(letters: string[]): boolean {
    const text = this.getArabicText();
    return letters.some(letter => text.includes(letter));
  }

  /**
   * Get word frequency score (if available from analysis)
   */
  getFrequencyScore(): number | null {
    // This would be populated by grammar analysis
    return null;
  }

  /**
   * Convert to storage format
   */
  toStorage(): WordStorageData {
    return {
      id: this.id,
      position: this.position,
      uthmani: this.uthmani,
      simple: this.simple,
      translation: this.translation,
      audioUrl: this.audioUrl
    };
  }

  /**
   * Create from storage data
   */
  static fromStorage(data: WordStorageData): Word {
    return new Word(
      data.id,
      data.position,
      data.uthmani,
      data.simple,
      data.translation,
      data.audioUrl
    );
  }
}

export interface WordStorageData {
  id: number;
  position: number;
  uthmani: string;
  simple?: string;
  translation?: WordTranslation;
  audioUrl?: string;
}