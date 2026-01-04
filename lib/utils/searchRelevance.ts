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
  
  // Remove HTML tags to get plain text
  const plainText = highlightedText.replace(/<[^>]+>/g, '').toLowerCase();
  
  return { plainText, highlightedWords };
}

/**
 * Normalize text for comparison:
 * - Lowercase
 * - Remove diacritics/accents (ā → a, etc.)
 * - Remove punctuation
 * - Normalize spaces
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    // Remove diacritics/accents (ā → a, Allāh → allah)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace punctuation with spaces (Unicode-aware for all scripts)
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    // Normalize multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get individual words from a query
 */
function getQueryWords(query: string): string[] {
  return normalizeText(query)
    .split(' ')
    .filter(word => word.length > 0);
}

/**
 * Highlight missing query words in the text.
 * The API highlights important words but skips common ones (the, to, of, etc.)
 * This function adds <em> tags to query words that weren't already highlighted.
 */
export function highlightMissingQueryWords(
  highlightedText: string,
  query: string
): string {
  const queryWords = getQueryWords(query);
  if (queryWords.length === 0) return highlightedText;
  
  // Find words already highlighted by the API
  const alreadyHighlighted = new Set<string>();
  const emRegex = /<em>([^<]+)<\/em>/gi;
  let match;
  while ((match = emRegex.exec(highlightedText)) !== null) {
    // Normalize the highlighted word for comparison
    normalizeText(match[1]!).split(' ').forEach(w => alreadyHighlighted.add(w));
  }
  
  // Find query words that need highlighting
  const wordsToHighlight = queryWords.filter(
    word => !alreadyHighlighted.has(word) && word.length > 1
  );
  
  if (wordsToHighlight.length === 0) return highlightedText;
  
  // Create regex to match these words (case-insensitive, word boundaries)
  let result = highlightedText;
  for (const word of wordsToHighlight) {
    // Escape special regex characters
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the word with word boundaries (case-insensitive)
    const wordRegex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');
    result = result.replace(wordRegex, '<em>$1</em>');
  }
  
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
export function calculateRelevanceScore(
  verse: SearchVerseResult,
  query: string
): RelevanceScore {
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
  
  const { plainText, highlightedWords } = extractHighlightInfo(
    verse.highlightedTranslation
  );
  
  // Check for exact phrase match using robust comparison
  const isExactMatch = containsExactPhrase(plainText, query);
  
  // Count how many query words appear in highlighted words
  let matchedWordCount = 0;
  for (const queryWord of queryWords) {
    // Check if any highlighted word contains or matches this query word
    const isMatched = highlightedWords.some(
      hw => hw.includes(queryWord) || queryWord.includes(hw)
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
  const scoredVerses: ScoredVerseResult[] = verses.map(verse => ({
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
  return verses.filter(v => v.relevanceScore.score >= minScore);
}

/**
 * Get the best matches for dropdown display.
 * 
 * Since quickSearch now does proper exact phrase filtering and sorting,
 * we just add relevance scores for display and limit results.
 * We DON'T re-sort because the API results are already properly ordered
 * with exact phrase matches first.
 */
export function getBestMatchesForDropdown(
  verses: SearchVerseResult[],
  query: string,
  maxResults: number = 10
): ScoredVerseResult[] {
  // Just add scores without re-sorting (API already sorted by relevance)
  const scored: ScoredVerseResult[] = verses.slice(0, maxResults).map(verse => ({
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
