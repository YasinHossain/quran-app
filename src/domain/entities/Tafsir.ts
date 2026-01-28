export interface TafsirData {
  id: number;
  name: string;
  lang: string;
  authorName?: string | undefined;
  slug?: string | undefined;
}

function validateTafsirData(data: TafsirData): void {
  if (!Number.isFinite(data.id) || data.id <= 0) {
    throw new Error('Invalid Tafsir data: id must be a positive number');
  }
  if (typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Invalid Tafsir data: name must be a non-empty string');
  }
  if (typeof data.lang !== 'string' || !data.lang.trim()) {
    throw new Error('Invalid Tafsir data: lang must be a non-empty string');
  }
  if (data.authorName !== undefined && typeof data.authorName !== 'string') {
    throw new Error('Invalid Tafsir data: authorName must be a string when provided');
  }
  if (data.slug !== undefined && typeof data.slug !== 'string') {
    throw new Error('Invalid Tafsir data: slug must be a string when provided');
  }
}

/**
 * Tafsir Domain Entity
 *
 * Represents a Tafsir (Quranic commentary) resource with business logic
 * for validation, language handling, and display formatting.
 */
export class Tafsir {
  constructor(private readonly data: TafsirData) {
    // Validate shape on construction (dev-only to keep production bundles lean)
    if (process.env.NODE_ENV !== 'production') {
      validateTafsirData(data);
    }
  }

  // Getters for accessing data
  get id(): number {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get language(): string {
    return this.data.lang;
  }

  get authorName(): string | undefined {
    return this.data.authorName;
  }

  get slug(): string | undefined {
    return this.data.slug;
  }

  /**
   * Get the display name with proper capitalization
   */
  get displayName(): string {
    return this.name;
  }

  /**
   * Get formatted language name with proper capitalization
   */
  get formattedLanguage(): string {
    return this.capitalizeLanguageName(this.language);
  }

  /**
   * Check if this tafsir is in a specific language
   */
  isInLanguage(language: string): boolean {
    return this.language.toLowerCase() === language.toLowerCase();
  }

  /**
   * Check if this tafsir matches a search term
   */
  matchesSearch(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      this.name.toLowerCase().includes(term) ||
      this.language.toLowerCase().includes(term) ||
      Boolean(this.authorName && this.authorName.toLowerCase().includes(term))
    );
  }

  /**
   * Get the priority for language sorting
   * English gets highest priority, then Bengali, then Arabic, then others
   */
  getLanguagePriority(): number {
    const lang = this.language.toLowerCase();
    switch (lang) {
      case 'english':
        return 0;
      case 'bengali':
      case 'bangla':
        return 1;
      case 'arabic':
        return 2;
      default:
        return 3;
    }
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): TafsirData {
    return { ...this.data };
  }

  /**
   * Create from plain object (for deserialization)
   */
  static fromJSON(data: TafsirData): Tafsir {
    return new Tafsir(data);
  }

  /**
   * Compare two tafsirs for equality
   */
  equals(other: Tafsir): boolean {
    return this.id === other.id;
  }

  /**
   * Private helper to capitalize language names
   */
  private capitalizeLanguageName(lang: string): string {
    return lang
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
