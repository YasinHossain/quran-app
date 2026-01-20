/**
 * Search Relevance Scoring Utility
 *
 * Provides client-side relevance scoring for search results to improve
 * the ordering and display of results in both dropdown and search page.
 *
 * This compensates for limitations in the API's default ranking by:
 * 1. Prioritizing exact phrase matches
 * 2. Counting matched words in highlighted text
 * 3. Scoring based on match density (matches / total words)
 */

import type { SearchVerseResult } from '@/lib/api/search';

// ============================================================================
// Types
// ============================================================================

export interface RelevanceScore {
  /** Overall relevance score (0-100, higher is more relevant) */
  score: number;
  /** True if the exact query phrase appears in the text */
  isExactMatch: boolean;
  /** Number of query words that were matched */
  matchedWordCount: number;
  /** Total query words */
  totalQueryWords: number;
  /** Percentage of query words matched (0-1) */
  matchRatio: number;
}

export interface ScoredVerseResult extends SearchVerseResult {
  relevanceScore: RelevanceScore;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Safely strip HTML tags from a string using DOM parsing when available.
 * Falls back to a conservative regex approach for server-side rendering.
 */
function stripHtmlTags(html: string): string {
  // Use DOMParser in browser environments for safe HTML stripping
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    } catch {
      // Fall through to fallback
    }
  }

  // Server-side fallback: use a more conservative approach
  // First decode any HTML entities, then strip tags iteratively
  // to handle nested/malformed tags
  let result = html;
  let prevResult = '';

  // Iterate until no more tags are found (handles nested cases like <<script>script>)
  while (result !== prevResult) {
    prevResult = result;
    result = result.replace(/<[^>]*>/g, '');
  }

  return result;
}

/**
 * Extract text content from highlighted HTML (removes <em> tags but counts them)
 */
function extractHighlightInfo(highlightedText: string): {
  plainText: string;
  highlightedWords: string[];
} {
  // Extract words wrapped in <em> tags
  const emRegex = /<em>([^<]+)<\/em>/gi;
  const highlightedWords: string[] = [];
  let match;

  while ((match = emRegex.exec(highlightedText)) !== null) {
    highlightedWords.push(match[1]!.toLowerCase().trim());
  }

  // Remove HTML tags to get plain text using safe DOM-based approach
  const plainText = stripHtmlTags(highlightedText).toLowerCase();

  return { plainText, highlightedWords };
}

/**
 * Remove Arabic diacritics (tashkeel/harakat) from text
 * These marks include: َ ِ ُ ّ ْ ً ٌ ٍ ٰ ٓ etc.
 */
function removeArabicDiacritics(text: string): string {
  // Arabic diacritic marks range: U+064B to U+065F, U+0670, U+06D6 to U+06ED
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

/**
 * Normalize Arabic text variations:
 * - Normalize different forms of Alef: إ أ آ ٱ → ا
 * - Normalize different forms of Hamza: ء ئ ؤ → (removed or normalized)
 * - Normalize Teh Marbuta: ة → ه
 * This allows flexible matching of Arabic text
 */
function normalizeArabicLetters(text: string): string {
  return (
    text
      // Normalize all Alef variations to simple Alef
      .replace(/[إأآٱ]/g, 'ا')
      // Normalize Hamza variations
      .replace(/[ئؤ]/g, 'ء')
      // Normalize Teh Marbuta to Heh
      .replace(/ة/g, 'ه')
      // Normalize Yeh variations (if needed)
      .replace(/ى/g, 'ي')
  );
}

/**
 * Normalize text for comparison:
 * - Remove Arabic diacritics first (for Arabic text)
 * - Normalize Arabic letter variations
 * - Lowercase
 * - Remove Latin diacritics/accents (ā → a, etc.)
 * - Remove punctuation
 * - Normalize spaces
 */
function normalizeText(text: string): string {
  return (
    normalizeArabicLetters(removeArabicDiacritics(text))
      .toLowerCase()
      // Remove Latin diacritics/accents (ā → a, Allāh → allah)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace punctuation with spaces (Unicode-aware for all scripts)
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      // Normalize multiple spaces
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Get individual words from a query
 */
function getQueryWords(query: string): string[] {
  return normalizeText(query)
    .split(' ')
    .filter((word) => word.length > 0);
}

/**
 * Highlight missing query words in the text.
 * The API highlights important words but skips common ones (the, to, of, etc.)
 * This function adds <em> tags to query words that weren't already highlighted.
 *
 * Works with both Arabic and Latin scripts.
 * For Arabic, it removes diacritics before matching so that queries without
 * diacritics can match Quranic text with diacritics.
 */
export function highlightMissingQueryWords(highlightedText: string, query: string): string {
  const queryWords = getQueryWords(query);
  if (queryWords.length === 0) return highlightedText;

  // Find words already highlighted by the API
  const alreadyHighlighted = new Set<string>();
  const emRegex = /<em>([^<]+)<\/em>/gi;
  let match;
  while ((match = emRegex.exec(highlightedText)) !== null) {
    // Normalize the highlighted word for comparison
    normalizeText(match[1]!)
      .split(' ')
      .forEach((w) => alreadyHighlighted.add(w));
  }

  // Find query words that need highlighting
  const wordsToHighlight = queryWords.filter(
    (word) => !alreadyHighlighted.has(word) && word.length > 1
  );

  if (wordsToHighlight.length === 0) return highlightedText;

  // For Arabic text, we need to match without diacritics but highlight with them
  let result = highlightedText;

  for (const word of wordsToHighlight) {
    const isArabicWord = /[\u0600-\u06FF]/.test(word);

    if (isArabicWord) {
      // Arabic: Build a regex that matches each character with optional diacritics
      // AND matches letter variations (e.g., ا matches إ, أ, آ, etc.)
      const chars = word.split('');

      // Enhanced diacritic pattern to include:
      // - Standard diacritics (064B-065F)
      // - Superscript Alef (0670)
      // - Arabic Letter High Hamza (0674-0678)
      // - Small phonetic letters: Small Waw (06E5), Small Yeh (06E6), Small High Yeh (06E7), Small High Noon (06E8)
      // EXCLUDES: Pause marks (06D6-06DC), Stops/Dots (06EA-06ED), End of Ayah (06DD)
      const diacriticPattern = '[\\u064B-\\u065F\\u0670\\u0674-\\u0678\\u06E5-\\u06E8]*';

      const regexPattern = chars
        .map((char) => {
          let charPattern = '';

          // Create character class that matches the letter and its variations
          if (char === 'ا') {
            // Match any form of Alef including those with hamza and madda
            charPattern = '[اإأآٱ]';
          } else if (char === 'ه') {
            // Match Heh or Teh Marbuta
            charPattern = '[هة]';
          } else if (char === 'ي') {
            // Match Yeh variations
            charPattern = '[يى]';
          } else if (char === 'ء') {
            // Match Hamza variations
            charPattern = '[ءئؤإأ]';
          } else {
            // Escape special regex characters for other letters
            charPattern = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          }

          // Add optional diacritics after each character
          return charPattern + diacriticPattern;
        })
        .join('');

      // Simpler word boundary pattern for Arabic
      // Match word at start/end of string or surrounded by spaces/punctuation
      const wordRegex = new RegExp(
        `(^|\\s|>)(${regexPattern})(?=\\s|$|<|[\\u060C\\u061B\\u061F])`,
        'g'
      );
      result = result.replace(wordRegex, '$1<em>$2</em>');
    } else {
      // Latin: Use word boundaries
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordRegex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');
      result = result.replace(wordRegex, '<em>$1</em>');
    }
  }

  // Clean up any nested or duplicate em tags
  result = result.replace(/<em>([^<]*)<em>([^<]*)<\/em>([^<]*)<\/em>/g, '<em>$1$2$3</em>');
  result = result.replace(/<em><\/em>/g, '');

  return result;
}

/**
 * Check if a text contains an exact phrase match.
 * This is more robust than simple includes() as it:
 * 1. Normalizes both strings (removes diacritics, punctuation)
 * 2. Checks for word boundaries
 */
function containsExactPhrase(text: string, phrase: string): boolean {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);

  // Simple containment check after normalization
  if (normalizedText.includes(normalizedPhrase)) {
    return true;
  }

  // Also check word-by-word for consecutive matches
  const textWords = normalizedText.split(' ');
  const phraseWords = normalizedPhrase.split(' ');

  if (phraseWords.length === 0) return false;

  // Sliding window to find consecutive word matches
  for (let i = 0; i <= textWords.length - phraseWords.length; i++) {
    let allMatch = true;
    for (let j = 0; j < phraseWords.length; j++) {
      if (textWords[i + j] !== phraseWords[j]) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate relevance score for a verse result
 */
export function calculateRelevanceScore(verse: SearchVerseResult, query: string): RelevanceScore {
  const queryWords = getQueryWords(query);
  const totalQueryWords = queryWords.length;

  if (totalQueryWords === 0) {
    return {
      score: 0,
      isExactMatch: false,
      matchedWordCount: 0,
      totalQueryWords: 0,
      matchRatio: 0,
    };
  }

  const { plainText, highlightedWords } = extractHighlightInfo(verse.highlightedTranslation);

  // Check for exact phrase match using robust comparison
  const isExactMatch = containsExactPhrase(plainText, query);

  // Count how many query words appear in highlighted words
  let matchedWordCount = 0;
  for (const queryWord of queryWords) {
    // Check if any highlighted word contains or matches this query word
    const isMatched = highlightedWords.some(
      (hw) => hw.includes(queryWord) || queryWord.includes(hw)
    );
    if (isMatched) {
      matchedWordCount++;
    }
  }

  const matchRatio = matchedWordCount / totalQueryWords;

  // Calculate overall score (0-100)
  let score = 0;

  // Base score from match ratio (0-50 points)
  score += matchRatio * 50;

  // Bonus for exact phrase match (30 points)
  if (isExactMatch) {
    score += 30;
  }

  // Bonus for all words matched (20 points)
  if (matchedWordCount === totalQueryWords) {
    score += 20;
  }

  // Small bonus for more highlighted words (indicates stronger match)
  const highlightDensity = Math.min(highlightedWords.length / 10, 1);
  score += highlightDensity * 10;

  return {
    score: Math.min(100, Math.round(score)),
    isExactMatch,
    matchedWordCount,
    totalQueryWords,
    matchRatio,
  };
}

/**
 * Score and sort verse results by relevance
 */
export function scoreAndSortVerses(
  verses: SearchVerseResult[],
  query: string
): ScoredVerseResult[] {
  // Calculate scores for all verses
  const scoredVerses: ScoredVerseResult[] = verses.map((verse) => ({
    ...verse,
    relevanceScore: calculateRelevanceScore(verse, query),
  }));

  // Sort by score (highest first)
  scoredVerses.sort((a, b) => b.relevanceScore.score - a.relevanceScore.score);

  return scoredVerses;
}

/**
 * Filter verses to only include highly relevant results (for dropdown)
 * Returns verses that have at least a minimum relevance score
 */
export function filterHighlyRelevant(
  verses: ScoredVerseResult[],
  minScore: number = 40
): ScoredVerseResult[] {
  return verses.filter((v) => v.relevanceScore.score >= minScore);
}

/**
 * Get the best matches for dropdown display.
 *
 * For dropdown preview, we keep the API order and only add relevance
 * scores for display. We don't re-sort to keep the preview lightweight.
 */
export function getBestMatchesForDropdown(
  verses: SearchVerseResult[],
  query: string,
  maxResults: number = 10
): ScoredVerseResult[] {
  // Just add scores without re-sorting (API already sorted by relevance)
  const scored: ScoredVerseResult[] = verses.slice(0, maxResults).map((verse) => ({
    ...verse,
    relevanceScore: calculateRelevanceScore(verse, query),
  }));

  return scored;
}

/**
 * Sort verses for search page display
 * Keeps partial matches but sorts by relevance
 */
export function sortVersesForSearchPage(
  verses: SearchVerseResult[],
  query: string
): ScoredVerseResult[] {
  return scoreAndSortVerses(verses, query);
}
