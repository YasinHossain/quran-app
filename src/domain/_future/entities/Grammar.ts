/**
 * Domain Entity: Grammar
 * 
 * Represents grammatical analysis and rules for Quranic text.
 * Supports future grammar research features.
 */

export interface GrammarRule {
  id: string;
  type: GrammarRuleType;
  name: string;
  description: string;
  arabicName?: string;
  examples: GrammarExample[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: GrammarCategory;
}

export type GrammarRuleType = 
  | 'morphology'    // Word formation, roots, patterns
  | 'syntax'        // Sentence structure, i'rab
  | 'semantics'     // Meaning and context
  | 'phonology'     // Sound and pronunciation
  | 'rhetoric'      // Literary devices, balagha
  | 'pragmatics';   // Context and interpretation

export type GrammarCategory =
  | 'noun'          // Ism
  | 'verb'          // Fi'l
  | 'particle'      // Harf
  | 'sentence'      // Jumlah
  | 'phrase'        // Tarkib
  | 'root_pattern'  // Wazan
  | 'conjugation'   // Tasrif
  | 'declension'    // I'rab
  | 'rhetoric';     // Balagha

export interface GrammarExample {
  id: string;
  verseKey: string;
  wordPosition?: number;
  arabicText: string;
  transliteration?: string;
  translation: string;
  explanation: string;
  highlights?: HighlightSpan[];
}

export interface HighlightSpan {
  start: number;
  end: number;
  type: 'root' | 'pattern' | 'prefix' | 'suffix' | 'grammatical_marker';
  label: string;
}

export interface GrammarAnalysisResult {
  id: string;
  verseKey: string;
  wordId: number;
  analysisType: GrammarRuleType;
  confidence: number;
  findings: GrammarFinding[];
  timestamp: number;
  source: 'manual' | 'ai' | 'traditional' | 'modern';
  reviewer?: string;
  status: 'draft' | 'reviewed' | 'verified' | 'disputed';
}

export interface GrammarFinding {
  ruleId: string;
  description: string;
  evidence: string[];
  alternativeInterpretations?: string[];
  confidence: number;
}

export class Grammar {
  private constructor(
    public readonly id: string,
    public readonly type: GrammarRuleType,
    public readonly category: GrammarCategory,
    public readonly rules: GrammarRule[],
    public readonly analysisResults: GrammarAnalysisResult[],
    public readonly createdAt: number,
    public readonly lastUpdated: number
  ) {}

  /**
   * Factory method to create new grammar domain
   */
  static create(
    type: GrammarRuleType,
    category: GrammarCategory
  ): Grammar {
    const id = `grammar_${type}_${category}_${Date.now()}`;
    const now = Date.now();
    
    return new Grammar(id, type, category, [], [], now, now);
  }

  /**
   * Factory method to reconstruct from storage
   */
  static fromStorage(data: {
    id: string;
    type: GrammarRuleType;
    category: GrammarCategory;
    rules: GrammarRule[];
    analysisResults: GrammarAnalysisResult[];
    createdAt: number;
    lastUpdated: number;
  }): Grammar {
    return new Grammar(
      data.id,
      data.type,
      data.category,
      data.rules,
      data.analysisResults,
      data.createdAt,
      data.lastUpdated
    );
  }

  /**
   * Add grammar rule (returns new instance - immutable)
   */
  addRule(rule: GrammarRule): Grammar {
    return new Grammar(
      this.id,
      this.type,
      this.category,
      [...this.rules, rule],
      this.analysisResults,
      this.createdAt,
      Date.now()
    );
  }

  /**
   * Update grammar rule (returns new instance - immutable)
   */
  updateRule(ruleId: string, updates: Partial<GrammarRule>): Grammar {
    const updatedRules = this.rules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );

    return new Grammar(
      this.id,
      this.type,
      this.category,
      updatedRules,
      this.analysisResults,
      this.createdAt,
      Date.now()
    );
  }

  /**
   * Remove grammar rule (returns new instance - immutable)
   */
  removeRule(ruleId: string): Grammar {
    const filteredRules = this.rules.filter(rule => rule.id !== ruleId);
    
    return new Grammar(
      this.id,
      this.type,
      this.category,
      filteredRules,
      this.analysisResults,
      this.createdAt,
      Date.now()
    );
  }

  /**
   * Add analysis result (returns new instance - immutable)
   */
  addAnalysisResult(result: GrammarAnalysisResult): Grammar {
    return new Grammar(
      this.id,
      this.type,
      this.category,
      this.rules,
      [...this.analysisResults, result],
      this.createdAt,
      Date.now()
    );
  }

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): GrammarRule | null {
    return this.rules.find(rule => rule.id === ruleId) || null;
  }

  /**
   * Get rules by difficulty level
   */
  getRulesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): GrammarRule[] {
    return this.rules.filter(rule => rule.difficulty === difficulty);
  }

  /**
   * Search rules by name or description
   */
  searchRules(query: string): GrammarRule[] {
    const lowerQuery = query.toLowerCase();
    return this.rules.filter(rule =>
      rule.name.toLowerCase().includes(lowerQuery) ||
      rule.description.toLowerCase().includes(lowerQuery) ||
      rule.arabicName?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get analysis results for a specific verse
   */
  getAnalysisForVerse(verseKey: string): GrammarAnalysisResult[] {
    return this.analysisResults.filter(result => result.verseKey === verseKey);
  }

  /**
   * Get analysis results by confidence threshold
   */
  getHighConfidenceAnalysis(threshold: number = 0.8): GrammarAnalysisResult[] {
    return this.analysisResults.filter(result => result.confidence >= threshold);
  }

  /**
   * Get analysis results by status
   */
  getAnalysisByStatus(status: GrammarAnalysisResult['status']): GrammarAnalysisResult[] {
    return this.analysisResults.filter(result => result.status === status);
  }

  /**
   * Get rules with examples from specific verses
   */
  getRulesWithVerseExamples(verseKeys: string[]): GrammarRule[] {
    return this.rules.filter(rule =>
      rule.examples.some(example => verseKeys.includes(example.verseKey))
    );
  }

  /**
   * Get grammar statistics
   */
  getStatistics(): GrammarStatistics {
    const rulesByDifficulty = {
      beginner: this.getRulesByDifficulty('beginner').length,
      intermediate: this.getRulesByDifficulty('intermediate').length,
      advanced: this.getRulesByDifficulty('advanced').length
    };

    const analysisByStatus = {
      draft: this.getAnalysisByStatus('draft').length,
      reviewed: this.getAnalysisByStatus('reviewed').length,
      verified: this.getAnalysisByStatus('verified').length,
      disputed: this.getAnalysisByStatus('disputed').length
    };

    const avgConfidence = this.analysisResults.length > 0
      ? this.analysisResults.reduce((sum, result) => sum + result.confidence, 0) / this.analysisResults.length
      : 0;

    return {
      totalRules: this.rules.length,
      totalAnalysisResults: this.analysisResults.length,
      rulesByDifficulty,
      analysisByStatus,
      averageConfidence: avgConfidence,
      uniqueVersesAnalyzed: new Set(this.analysisResults.map(r => r.verseKey)).size
    };
  }

  /**
   * Validate rule completeness
   */
  validateRule(rule: GrammarRule): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rule.name.trim()) errors.push('Rule name is required');
    if (!rule.description.trim()) errors.push('Rule description is required');
    if (rule.examples.length === 0) warnings.push('Rule has no examples');
    if (rule.examples.length > 0) {
      rule.examples.forEach((example, index) => {
        if (!example.arabicText.trim()) {
          errors.push(`Example ${index + 1} is missing Arabic text`);
        }
        if (!example.translation.trim()) {
          warnings.push(`Example ${index + 1} is missing translation`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Export rules as JSON
   */
  exportRules(): string {
    return JSON.stringify({
      grammarDomain: {
        id: this.id,
        type: this.type,
        category: this.category,
        rules: this.rules,
        exportedAt: new Date().toISOString()
      }
    }, null, 2);
  }

  /**
   * Convert to storage format
   */
  toStorage(): GrammarStorageData {
    return {
      id: this.id,
      type: this.type,
      category: this.category,
      rules: this.rules,
      analysisResults: this.analysisResults,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated
    };
  }
}

export interface GrammarStatistics {
  totalRules: number;
  totalAnalysisResults: number;
  rulesByDifficulty: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  analysisByStatus: {
    draft: number;
    reviewed: number;
    verified: number;
    disputed: number;
  };
  averageConfidence: number;
  uniqueVersesAnalyzed: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface GrammarStorageData {
  id: string;
  type: GrammarRuleType;
  category: GrammarCategory;
  rules: GrammarRule[];
  analysisResults: GrammarAnalysisResult[];
  createdAt: number;
  lastUpdated: number;
}

/**
 * Grammar utility functions
 */
export class GrammarUtils {
  /**
   * Create a new grammar rule
   */
  static createRule(
    type: GrammarRuleType,
    category: GrammarCategory,
    name: string,
    description: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): GrammarRule {
    return {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      description,
      examples: [],
      difficulty,
      category
    };
  }

  /**
   * Create a grammar example
   */
  static createExample(
    verseKey: string,
    arabicText: string,
    translation: string,
    explanation: string,
    wordPosition?: number
  ): GrammarExample {
    return {
      id: `example_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      verseKey,
      wordPosition,
      arabicText,
      translation,
      explanation
    };
  }

  /**
   * Extract root from Arabic word (simplified)
   */
  static extractRoot(arabicWord: string): string | null {
    // This would be implemented with proper Arabic morphological analysis
    // For now, return null as placeholder
    return null;
  }

  /**
   * Identify word pattern (simplified)
   */
  static identifyPattern(arabicWord: string): string | null {
    // This would be implemented with proper pattern matching
    // For now, return null as placeholder
    return null;
  }
}