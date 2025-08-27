/**
 * Repository Interface: IGrammarRepository
 *
 * Defines the contract for grammar analysis data persistence and retrieval.
 * Supports future grammar research features.
 */

import {
  Grammar,
  GrammarRule,
  GrammarAnalysisResult,
  GrammarRuleType,
  GrammarCategory,
  GrammarStorageData,
} from '../entities/Grammar';

export interface GrammarQuery {
  type?: GrammarRuleType;
  category?: GrammarCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  searchTerm?: string;
}

export interface AnalysisQuery {
  verseKey?: string;
  wordId?: number;
  analysisType?: GrammarRuleType;
  confidence?: number; // minimum confidence
  status?: 'draft' | 'reviewed' | 'verified' | 'disputed';
  source?: 'manual' | 'ai' | 'traditional' | 'modern';
}

export interface IGrammarRepository {
  // Grammar domain operations
  /**
   * Get all grammar domains
   */
  getGrammarDomains(): Promise<Grammar[]>;

  /**
   * Get grammar domain by ID
   */
  getGrammarDomain(id: string): Promise<Grammar | null>;

  /**
   * Get grammar domain by type and category
   */
  getGrammarDomainByTypeCategory(
    type: GrammarRuleType,
    category: GrammarCategory
  ): Promise<Grammar | null>;

  /**
   * Save or update grammar domain
   */
  saveGrammarDomain(grammar: Grammar): Promise<void>;

  /**
   * Delete grammar domain
   */
  deleteGrammarDomain(id: string): Promise<void>;

  // Grammar rule operations
  /**
   * Get all grammar rules
   */
  getAllRules(): Promise<GrammarRule[]>;

  /**
   * Get rules by query parameters
   */
  getRules(query: GrammarQuery): Promise<GrammarRule[]>;

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): Promise<GrammarRule | null>;

  /**
   * Save or update grammar rule
   */
  saveRule(rule: GrammarRule): Promise<void>;

  /**
   * Delete grammar rule
   */
  deleteRule(ruleId: string): Promise<void>;

  /**
   * Search rules by text content
   */
  searchRules(query: string): Promise<GrammarRule[]>;

  // Grammar analysis operations
  /**
   * Get all analysis results
   */
  getAllAnalysisResults(): Promise<GrammarAnalysisResult[]>;

  /**
   * Get analysis results by query
   */
  getAnalysisResults(query: AnalysisQuery): Promise<GrammarAnalysisResult[]>;

  /**
   * Get analysis for specific verse
   */
  getVerseAnalysis(verseKey: string): Promise<GrammarAnalysisResult[]>;

  /**
   * Get analysis for specific word
   */
  getWordAnalysis(verseKey: string, wordId: number): Promise<GrammarAnalysisResult[]>;

  /**
   * Save analysis result
   */
  saveAnalysisResult(result: GrammarAnalysisResult): Promise<void>;

  /**
   * Update analysis result status
   */
  updateAnalysisStatus(
    resultId: string,
    status: 'draft' | 'reviewed' | 'verified' | 'disputed'
  ): Promise<void>;

  /**
   * Delete analysis result
   */
  deleteAnalysisResult(resultId: string): Promise<void>;

  // Batch operations
  /**
   * Import grammar rules from external source
   */
  importRules(rules: GrammarRule[]): Promise<void>;

  /**
   * Export grammar rules
   */
  exportRules(query?: GrammarQuery): Promise<GrammarRule[]>;

  /**
   * Import analysis results
   */
  importAnalysisResults(results: GrammarAnalysisResult[]): Promise<void>;

  /**
   * Export analysis results
   */
  exportAnalysisResults(query?: AnalysisQuery): Promise<GrammarAnalysisResult[]>;

  // Statistics and insights
  /**
   * Get grammar statistics
   */
  getGrammarStatistics(): Promise<{
    totalRules: number;
    rulesByType: Record<GrammarRuleType, number>;
    rulesByCategory: Record<GrammarCategory, number>;
    rulesByDifficulty: Record<'beginner' | 'intermediate' | 'advanced', number>;
    totalAnalysisResults: number;
    analysisResultsByStatus: Record<string, number>;
    averageConfidence: number;
    uniqueVersesAnalyzed: number;
    topAnalyzedVerses: Array<{ verseKey: string; analysisCount: number }>;
  }>;

  /**
   * Get rule usage statistics
   */
  getRuleUsageStats(): Promise<
    Array<{
      ruleId: string;
      ruleName: string;
      usageCount: number;
      lastUsed: number; // timestamp
    }>
  >;

  /**
   * Get analysis confidence distribution
   */
  getConfidenceDistribution(): Promise<{
    high: number; // > 0.8
    medium: number; // 0.5 - 0.8
    low: number; // < 0.5
  }>;

  // Research and discovery
  /**
   * Find similar grammar patterns
   */
  findSimilarPatterns(
    verseKey: string,
    wordId: number
  ): Promise<
    Array<{
      verseKey: string;
      wordId: number;
      similarity: number;
      pattern: string;
    }>
  >;

  /**
   * Get grammar patterns by frequency
   */
  getPatternsByFrequency(limit?: number): Promise<
    Array<{
      pattern: string;
      frequency: number;
      examples: Array<{ verseKey: string; wordId: number }>;
    }>
  >;

  /**
   * Suggest analysis based on existing patterns
   */
  suggestAnalysis(
    verseKey: string,
    wordId: number
  ): Promise<
    Array<{
      ruleId: string;
      confidence: number;
      reasoning: string;
    }>
  >;

  // Collaboration features
  /**
   * Get analysis by reviewer
   */
  getAnalysisByReviewer(reviewerName: string): Promise<GrammarAnalysisResult[]>;

  /**
   * Get disputed analyses
   */
  getDisputedAnalyses(): Promise<GrammarAnalysisResult[]>;

  /**
   * Add review comment to analysis
   */
  addReviewComment(resultId: string, comment: string, reviewer: string): Promise<void>;

  // Storage management
  /**
   * Clear all grammar data
   */
  clearAll(): Promise<void>;

  /**
   * Backup grammar data
   */
  backup(): Promise<{
    domains: GrammarStorageData[];
    timestamp: number;
  }>;

  /**
   * Restore grammar data from backup
   */
  restore(backup: { domains: GrammarStorageData[]; timestamp: number }): Promise<void>;
}
