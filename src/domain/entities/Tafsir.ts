import { z } from 'zod';

// Validation schema for Tafsir
export const TafsirSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  lang: z.string().min(1),
  authorName: z.string().optional(),
  slug: z.string().optional(),
});

export type TafsirData = z.infer<typeof TafsirSchema>;

/**
 * Tafsir Domain Entity
 *
 * Represents a Tafsir (Quranic commentary) resource with business logic
 * for validation, language handling, and display formatting.
 */
export class Tafsir {
  constructor(private readonly data: TafsirData) {
    // Validate data on construction
    TafsirSchema.parse(data);
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
