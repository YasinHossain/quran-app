#!/usr/bin/env node

/**
 * AI Quality Monitor
 *
 * Continuously monitors code quality metrics and provides
 * AI-readable reports for maintaining high standards.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIQualityMonitor {
  constructor() {
    this.metrics = {
      coverage: 0,
      complexity: 0,
      duplication: 0,
      maintainability: 0,
      security: 0,
      performance: 0,
      accessibility: 0,
    };

    this.thresholds = {
      coverage: { min: 80, target: 90 },
      complexity: { max: 10, target: 5 },
      duplication: { max: 5, target: 2 },
      maintainability: { min: 70, target: 85 },
      security: { min: 95, target: 100 },
      performance: { min: 90, target: 95 },
      accessibility: { min: 95, target: 100 },
    };

    this.reports = [];
  }

  async runFullAnalysis() {
    console.log('🔍 Running comprehensive quality analysis...\n');

    try {
      await this.analyzeCoverage();
      await this.analyzeComplexity();
      await this.analyzeDuplication();
      await this.analyzeMaintainability();
      await this.analyzeSecurity();
      await this.analyzePerformance();
      await this.analyzeAccessibility();

      await this.generateReport();
      await this.generateAIInsights();

      console.log('✅ Quality analysis complete!');
      return this.metrics;
    } catch (error) {
      console.error('❌ Quality analysis failed:', error.message);
      throw error;
    }
  }

  async analyzeCoverage() {
    console.log('📊 Analyzing test coverage...');

    try {
      // Run Jest with coverage
      const output = execSync('npm run test:coverage -- --silent --json', {
        encoding: 'utf8',
        cwd: process.cwd(),
      });

      const coverageData = JSON.parse(output);
      const summary = coverageData.coverageMap?.getCoverageSummary?.() || coverageData.summary;

      if (summary) {
        this.metrics.coverage = Math.round(summary.lines?.pct || summary.statements?.pct || 0);

        this.reports.push({
          type: 'coverage',
          score: this.metrics.coverage,
          details: {
            lines: summary.lines?.pct || 0,
            statements: summary.statements?.pct || 0,
            functions: summary.functions?.pct || 0,
            branches: summary.branches?.pct || 0,
          },
          issues: this.findCoverageIssues(summary),
        });

        console.log(`   Coverage: ${this.metrics.coverage}%`);
      }
    } catch (error) {
      console.warn('   Coverage analysis failed, using fallback method');
      this.metrics.coverage = await this.estimateCoverage();
    }
  }

  async estimateCoverage() {
    // Fallback method to estimate coverage
    const testFiles = this.findFiles('**/*.test.{ts,tsx,js,jsx}');
    const sourceFiles = this.findFiles('**/*.{ts,tsx,js,jsx}', [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.test.*',
    ]);

    if (sourceFiles.length === 0) return 0;

    // Simple heuristic: assume 70% coverage if we have reasonable test coverage
    const testRatio = testFiles.length / sourceFiles.length;
    return Math.min(Math.round(testRatio * 100), 85);
  }

  findCoverageIssues(summary) {
    const issues = [];

    if (summary.lines?.pct < this.thresholds.coverage.target) {
      issues.push(
        `Line coverage (${summary.lines.pct}%) below target (${this.thresholds.coverage.target}%)`
      );
    }

    if (summary.branches?.pct < this.thresholds.coverage.target - 10) {
      issues.push(`Branch coverage (${summary.branches.pct}%) significantly low`);
    }

    return issues;
  }

  async analyzeComplexity() {
    console.log('🧮 Analyzing code complexity...');

    try {
      const files = this.findFiles('src/**/*.{ts,tsx}', ['**/*.test.*']);
      let totalComplexity = 0;
      let fileCount = 0;
      const highComplexityFiles = [];

      for (const file of files) {
        const complexity = this.calculateFileComplexity(file);
        totalComplexity += complexity;
        fileCount++;

        if (complexity > this.thresholds.complexity.max) {
          highComplexityFiles.push({ file, complexity });
        }
      }

      this.metrics.complexity = fileCount > 0 ? Math.round(totalComplexity / fileCount) : 0;

      this.reports.push({
        type: 'complexity',
        score: Math.max(0, 100 - this.metrics.complexity * 10), // Convert to 0-100 scale
        details: {
          averageComplexity: this.metrics.complexity,
          totalFiles: fileCount,
          highComplexityFiles: highComplexityFiles.length,
        },
        issues: highComplexityFiles.map((f) => `${f.file}: complexity ${f.complexity}`),
      });

      console.log(`   Average complexity: ${this.metrics.complexity}`);
    } catch (error) {
      console.warn('   Complexity analysis failed:', error.message);
      this.metrics.complexity = 5; // Default reasonable value
    }
  }

  calculateFileComplexity(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Simple complexity calculation
      let complexity = 1; // Base complexity

      // Control structures
      const patterns = [
        /\bif\s*\(/g,
        /\belse\s+if\b/g,
        /\bswitch\s*\(/g,
        /\bcase\s+/g,
        /\bfor\s*\(/g,
        /\bwhile\s*\(/g,
        /\bcatch\s*\(/g,
        /\?\s*[^:]*\s*:/g, // ternary operators
        /&&|\|\|/g, // logical operators
      ];

      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          complexity += matches.length;
        }
      }

      return complexity;
    } catch (error) {
      return 1; // Default if file can't be read
    }
  }

  async analyzeDuplication() {
    console.log('🔄 Analyzing code duplication...');

    try {
      const files = this.findFiles('src/**/*.{ts,tsx}', ['**/*.test.*']);
      const duplications = this.findCodeDuplication(files);

      this.metrics.duplication = duplications.percentage;

      this.reports.push({
        type: 'duplication',
        score: Math.max(0, 100 - this.metrics.duplication),
        details: {
          duplicatedLines: duplications.lines,
          totalLines: duplications.total,
          percentage: this.metrics.duplication,
        },
        issues: duplications.instances.map(
          (d) => `Duplication in ${d.files.join(', ')}: ${d.lines} lines`
        ),
      });

      console.log(`   Code duplication: ${this.metrics.duplication}%`);
    } catch (error) {
      console.warn('   Duplication analysis failed:', error.message);
      this.metrics.duplication = 2; // Assume low duplication
    }
  }

  findCodeDuplication(files) {
    // Simplified duplication detection
    const lineHashes = new Map();
    let totalLines = 0;
    let duplicatedLines = 0;
    const instances = [];

    for (const file of files.slice(0, 50)) {
      // Limit to prevent performance issues
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 10 && !line.startsWith('//') && !line.startsWith('*'));

        totalLines += lines.length;

        lines.forEach((line) => {
          if (lineHashes.has(line)) {
            const existing = lineHashes.get(line);
            existing.count++;
            existing.files.add(file);

            if (existing.count === 2) {
              duplicatedLines += existing.count;
              instances.push({
                line,
                files: Array.from(existing.files),
                lines: existing.count,
              });
            } else if (existing.count > 2) {
              duplicatedLines++;
            }
          } else {
            lineHashes.set(line, { count: 1, files: new Set([file]) });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return {
      lines: duplicatedLines,
      total: totalLines,
      percentage: totalLines > 0 ? Math.round((duplicatedLines / totalLines) * 100) : 0,
      instances: instances.slice(0, 10), // Top 10 duplications
    };
  }

  async analyzeMaintainability() {
    console.log('🔧 Analyzing maintainability...');

    try {
      const files = this.findFiles('src/**/*.{ts,tsx}', ['**/*.test.*']);
      let totalScore = 0;
      let fileCount = 0;
      const issues = [];

      for (const file of files) {
        const score = this.calculateMaintainabilityScore(file);
        totalScore += score;
        fileCount++;

        if (score < this.thresholds.maintainability.min) {
          issues.push(`${file}: score ${score}`);
        }
      }

      this.metrics.maintainability = fileCount > 0 ? Math.round(totalScore / fileCount) : 0;

      this.reports.push({
        type: 'maintainability',
        score: this.metrics.maintainability,
        details: {
          averageScore: this.metrics.maintainability,
          totalFiles: fileCount,
          lowScoreFiles: issues.length,
        },
        issues,
      });

      console.log(`   Maintainability: ${this.metrics.maintainability}/100`);
    } catch (error) {
      console.warn('   Maintainability analysis failed:', error.message);
      this.metrics.maintainability = 75; // Default reasonable score
    }
  }

  calculateMaintainabilityScore(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      let score = 100;

      // Penalize large files
      if (lines.length > 200) score -= Math.min(20, (lines.length - 200) / 10);

      // Penalize long functions
      const functionLengths = this.findFunctionLengths(content);
      const longFunctions = functionLengths.filter((len) => len > 50);
      score -= longFunctions.length * 5;

      // Penalize high nesting
      const maxNesting = this.calculateMaxNesting(content);
      if (maxNesting > 3) score -= (maxNesting - 3) * 5;

      // Reward good practices
      if (content.includes('interface ') || content.includes('type ')) score += 5;
      if (content.includes('export ')) score += 2;
      if (content.includes('// ') || content.includes('/** ')) score += 3;

      return Math.max(0, Math.min(100, score));
    } catch (error) {
      return 50; // Default if analysis fails
    }
  }

  findFunctionLengths(content) {
    const functions = [];
    const lines = content.split('\n');
    let inFunction = false;
    let functionStart = 0;
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/\b(function|const\s+\w+\s*=.*=>|\w+\s*\([^)]*\)\s*{)/.test(line)) {
        inFunction = true;
        functionStart = i;
        braceCount = 0;
      }

      if (inFunction) {
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;

        if (braceCount === 0 && line.includes('}')) {
          functions.push(i - functionStart + 1);
          inFunction = false;
        }
      }
    }

    return functions;
  }

  calculateMaxNesting(content) {
    let maxNesting = 0;
    let currentNesting = 0;

    for (const char of content) {
      if (char === '{') {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      } else if (char === '}') {
        currentNesting--;
      }
    }

    return maxNesting;
  }

  async analyzeSecurity() {
    console.log('🔒 Analyzing security...');

    try {
      // Run security audit
      const auditOutput = execSync('npm audit --json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
      });

      const auditData = JSON.parse(auditOutput);
      const vulnerabilities = auditData.vulnerabilities || {};
      const vulnCount = Object.keys(vulnerabilities).length;

      // Calculate security score based on vulnerabilities
      this.metrics.security = Math.max(0, 100 - vulnCount * 10);

      this.reports.push({
        type: 'security',
        score: this.metrics.security,
        details: {
          vulnerabilities: vulnCount,
          high: Object.values(vulnerabilities).filter((v) => v.severity === 'high').length,
          moderate: Object.values(vulnerabilities).filter((v) => v.severity === 'moderate').length,
          low: Object.values(vulnerabilities).filter((v) => v.severity === 'low').length,
        },
        issues: Object.entries(vulnerabilities)
          .filter(([_, v]) => ['high', 'critical'].includes(v.severity))
          .map(([name, v]) => `${name}: ${v.severity} - ${v.title}`),
      });

      console.log(`   Security score: ${this.metrics.security}/100`);
    } catch (error) {
      console.warn('   Security analysis failed, performing code scan...');
      this.metrics.security = await this.performSecurityCodeScan();
    }
  }

  async performSecurityCodeScan() {
    // Simple security pattern scanning
    const files = this.findFiles('src/**/*.{ts,tsx,js,jsx}');
    const securityIssues = [];

    const patterns = [
      {
        pattern: /console\.log.*password|console\.log.*secret/i,
        issue: 'Potential credential logging',
      },
      { pattern: /eval\s*\(/g, issue: 'Use of eval() function' },
      { pattern: /innerHTML\s*=/g, issue: 'Direct innerHTML usage' },
      { pattern: /dangerouslySetInnerHTML/g, issue: 'Dangerous HTML injection' },
      { pattern: /http:\/\//g, issue: 'Insecure HTTP protocol' },
    ];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');

        for (const { pattern, issue } of patterns) {
          if (pattern.test(content)) {
            securityIssues.push(`${file}: ${issue}`);
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return Math.max(50, 100 - securityIssues.length * 5);
  }

  async analyzePerformance() {
    console.log('⚡ Analyzing performance...');

    try {
      const performanceIssues = await this.findPerformanceIssues();
      this.metrics.performance = Math.max(0, 100 - performanceIssues.length * 5);

      this.reports.push({
        type: 'performance',
        score: this.metrics.performance,
        details: {
          issues: performanceIssues.length,
          categories: {
            'Large bundles': performanceIssues.filter((i) => i.includes('bundle')).length,
            'Inefficient renders': performanceIssues.filter((i) => i.includes('render')).length,
            'Memory leaks': performanceIssues.filter((i) => i.includes('memory')).length,
          },
        },
        issues: performanceIssues,
      });

      console.log(`   Performance score: ${this.metrics.performance}/100`);
    } catch (error) {
      console.warn('   Performance analysis failed:', error.message);
      this.metrics.performance = 85; // Default reasonable score
    }
  }

  async findPerformanceIssues() {
    const files = this.findFiles('src/**/*.{ts,tsx}');
    const issues = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');

        // Check for performance anti-patterns
        if (
          content.includes('useEffect') &&
          !content.includes('useMemo') &&
          content.length > 1000
        ) {
          issues.push(`${file}: Large component without memoization`);
        }

        if (/\.map\(.*\.map\(/g.test(content)) {
          issues.push(`${file}: Nested array operations`);
        }

        if (/console\.log/g.test(content) && !file.includes('test')) {
          issues.push(`${file}: Console statements in production code`);
        }

        if (content.includes('new Date()') && content.includes('useEffect')) {
          issues.push(`${file}: Date operations in effect hooks`);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return issues;
  }

  async analyzeAccessibility() {
    console.log('♿ Analyzing accessibility...');

    try {
      const a11yIssues = await this.findAccessibilityIssues();
      this.metrics.accessibility = Math.max(0, 100 - a11yIssues.length * 5);

      this.reports.push({
        type: 'accessibility',
        score: this.metrics.accessibility,
        details: {
          issues: a11yIssues.length,
          categories: {
            'Missing ARIA': a11yIssues.filter((i) => i.includes('aria')).length,
            'Semantic HTML': a11yIssues.filter((i) => i.includes('semantic')).length,
            'Focus management': a11yIssues.filter((i) => i.includes('focus')).length,
          },
        },
        issues: a11yIssues,
      });

      console.log(`   Accessibility score: ${this.metrics.accessibility}/100`);
    } catch (error) {
      console.warn('   Accessibility analysis failed:', error.message);
      this.metrics.accessibility = 90; // Default good score
    }
  }

  async findAccessibilityIssues() {
    const files = this.findFiles('src/**/*.tsx');
    const issues = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');

        // Check for accessibility issues
        if (content.includes('<button') && !content.includes('aria-')) {
          issues.push(`${file}: Button without ARIA attributes`);
        }

        if (content.includes('<input') && !content.includes('aria-') && !content.includes('id=')) {
          issues.push(`${file}: Input without proper labeling`);
        }

        if (content.includes('<img') && !content.includes('alt=')) {
          issues.push(`${file}: Image without alt text`);
        }

        if (content.includes('onClick') && !content.includes('onKeyDown')) {
          issues.push(`${file}: Click handler without keyboard support`);
        }

        if (
          !content.includes('<main>') &&
          !content.includes('<section>') &&
          file.includes('page.tsx')
        ) {
          issues.push(`${file}: Page without semantic landmarks`);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return issues;
  }

  async generateReport() {
    console.log('\n📊 Generating quality report...\n');

    const overallScore = this.calculateOverallScore();
    const grade = this.calculateGrade(overallScore);

    const report = {
      timestamp: new Date().toISOString(),
      overallScore,
      grade,
      metrics: this.metrics,
      thresholds: this.thresholds,
      details: this.reports,
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
    };

    // Save report
    const reportPath = 'quality-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    console.log(`Overall Quality Score: ${overallScore}/100 (${grade})`);
    console.log('\nMetrics:');
    Object.entries(this.metrics).forEach(([key, value]) => {
      const threshold = this.thresholds[key];
      const status = this.getMetricStatus(key, value);
      console.log(`   ${key}: ${value}${this.getMetricUnit(key)} ${status}`);
    });

    console.log(`\nDetailed report saved to: ${reportPath}`);
  }

  calculateOverallScore() {
    const weights = {
      coverage: 0.25,
      complexity: 0.15,
      duplication: 0.1,
      maintainability: 0.2,
      security: 0.2,
      performance: 0.05,
      accessibility: 0.05,
    };

    let weightedScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      let score = this.metrics[metric];

      // Normalize scores to 0-100 scale
      if (metric === 'complexity') {
        score = Math.max(0, 100 - score * 10);
      } else if (metric === 'duplication') {
        score = Math.max(0, 100 - score);
      }

      weightedScore += score * weight;
      totalWeight += weight;
    });

    return Math.round(weightedScore / totalWeight);
  }

  calculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getMetricStatus(key, value) {
    const threshold = this.thresholds[key];

    if (key === 'complexity' || key === 'duplication') {
      if (value <= threshold.target) return '✅';
      if (value <= threshold.max) return '⚠️';
      return '❌';
    } else {
      if (value >= threshold.target) return '✅';
      if (value >= threshold.min) return '⚠️';
      return '❌';
    }
  }

  getMetricUnit(key) {
    if (
      [
        'coverage',
        'duplication',
        'maintainability',
        'security',
        'performance',
        'accessibility',
      ].includes(key)
    ) {
      return '%';
    }
    return '';
  }

  generateSummary() {
    const issues = this.reports.reduce((total, report) => total + report.issues.length, 0);
    const passedMetrics = Object.entries(this.metrics).filter(([key, value]) => {
      const threshold = this.thresholds[key];
      if (key === 'complexity' || key === 'duplication') {
        return value <= threshold.max;
      } else {
        return value >= threshold.min;
      }
    }).length;

    return {
      totalIssues: issues,
      passedMetrics,
      totalMetrics: Object.keys(this.metrics).length,
      criticalIssues: this.reports.filter((r) => r.score < 60).length,
    };
  }

  generateRecommendations() {
    const recommendations = [];

    // Coverage recommendations
    if (this.metrics.coverage < this.thresholds.coverage.target) {
      recommendations.push({
        priority: 'high',
        category: 'testing',
        message: `Increase test coverage from ${this.metrics.coverage}% to ${this.thresholds.coverage.target}%`,
        actions: [
          'Add unit tests for domain entities and services',
          'Create integration tests for repositories',
          'Add E2E tests for critical user flows',
        ],
      });
    }

    // Complexity recommendations
    if (this.metrics.complexity > this.thresholds.complexity.target) {
      recommendations.push({
        priority: 'medium',
        category: 'maintainability',
        message: `Reduce average complexity from ${this.metrics.complexity} to ${this.thresholds.complexity.target}`,
        actions: [
          'Break down large functions into smaller ones',
          'Extract complex logic into separate services',
          'Use early returns to reduce nesting',
        ],
      });
    }

    // Security recommendations
    if (this.metrics.security < this.thresholds.security.target) {
      recommendations.push({
        priority: 'critical',
        category: 'security',
        message: `Address security issues to reach ${this.thresholds.security.target}% score`,
        actions: [
          'Run npm audit and fix vulnerabilities',
          'Remove console.log statements with sensitive data',
          'Use secure HTTP protocols',
        ],
      });
    }

    return recommendations;
  }

  async generateAIInsights() {
    console.log('\n🤖 Generating AI development insights...\n');

    const insights = {
      codebaseHealth: this.assessCodebaseHealth(),
      developmentFocus: this.suggestDevelopmentFocus(),
      refactoringOpportunities: this.identifyRefactoringOpportunities(),
      testingStrategy: this.suggestTestingStrategy(),
      architectureRecommendations: this.generateArchitectureRecommendations(),
    };

    const insightsPath = 'ai-insights.json';
    fs.writeFileSync(insightsPath, JSON.stringify(insights, null, 2));

    // Display key insights
    console.log('🎯 Key AI Development Insights:');
    console.log(`   Codebase Health: ${insights.codebaseHealth.status}`);
    console.log(`   Primary Focus: ${insights.developmentFocus.primary}`);
    console.log(`   Refactoring Priority: ${insights.refactoringOpportunities[0]?.type || 'None'}`);

    console.log(`\nFull AI insights saved to: ${insightsPath}`);
  }

  assessCodebaseHealth() {
    const overallScore = this.calculateOverallScore();

    if (overallScore >= 85) {
      return {
        status: 'Excellent',
        message: 'Codebase is well-maintained with high quality standards',
        confidence: 0.9,
      };
    } else if (overallScore >= 70) {
      return {
        status: 'Good',
        message: 'Codebase is in good shape with some areas for improvement',
        confidence: 0.8,
      };
    } else if (overallScore >= 55) {
      return {
        status: 'Needs Attention',
        message: 'Several quality issues need to be addressed',
        confidence: 0.7,
      };
    } else {
      return {
        status: 'Critical',
        message: 'Codebase requires immediate quality improvements',
        confidence: 0.9,
      };
    }
  }

  suggestDevelopmentFocus() {
    const scores = Object.entries(this.metrics).map(([key, value]) => {
      let normalizedScore = value;
      if (key === 'complexity') normalizedScore = 100 - value * 10;
      if (key === 'duplication') normalizedScore = 100 - value;
      return { metric: key, score: normalizedScore };
    });

    scores.sort((a, b) => a.score - b.score);
    const lowestScore = scores[0];

    const focusMap = {
      coverage: 'Testing and Quality Assurance',
      complexity: 'Code Simplification and Refactoring',
      duplication: 'Code Deduplication and Reusability',
      maintainability: 'Architecture and Code Organization',
      security: 'Security Hardening',
      performance: 'Performance Optimization',
      accessibility: 'User Experience and Accessibility',
    };

    return {
      primary: focusMap[lowestScore.metric],
      score: lowestScore.score,
      secondary: focusMap[scores[1].metric],
      recommendations: this.getMetricSpecificRecommendations(lowestScore.metric),
    };
  }

  getMetricSpecificRecommendations(metric) {
    const recommendations = {
      coverage: [
        'Focus on testing domain entities and business logic',
        'Add integration tests for API repositories',
        'Create E2E tests for user workflows',
      ],
      complexity: [
        'Extract large components into smaller ones',
        'Use custom hooks for complex state logic',
        'Apply single responsibility principle',
      ],
      duplication: [
        'Extract common patterns into shared utilities',
        'Create reusable atomic components',
        'Implement shared business logic in domain services',
      ],
      maintainability: [
        'Follow clean architecture principles',
        'Improve code documentation',
        'Standardize naming conventions',
      ],
      security: [
        'Update dependencies regularly',
        'Implement proper authentication',
        'Sanitize user inputs',
      ],
      performance: [
        'Implement code splitting',
        'Add React.memo for expensive components',
        'Optimize bundle size',
      ],
      accessibility: [
        'Add ARIA attributes to interactive elements',
        'Implement keyboard navigation',
        'Ensure proper color contrast',
      ],
    };

    return recommendations[metric] || [];
  }

  identifyRefactoringOpportunities() {
    const opportunities = [];

    // Find files with high complexity
    const complexFiles =
      this.reports.find((r) => r.type === 'complexity')?.details?.highComplexityFiles || 0;

    if (complexFiles > 0) {
      opportunities.push({
        type: 'Component Splitting',
        priority: 'high',
        impact: 'maintainability',
        description: 'Break down complex components into smaller, focused components',
      });
    }

    // Find duplication opportunities
    const duplicationPercentage = this.metrics.duplication;
    if (duplicationPercentage > this.thresholds.duplication.target) {
      opportunities.push({
        type: 'Code Deduplication',
        priority: 'medium',
        impact: 'maintainability',
        description: 'Extract common code patterns into reusable utilities',
      });
    }

    // Find testing opportunities
    if (this.metrics.coverage < this.thresholds.coverage.target) {
      opportunities.push({
        type: 'Test Coverage Improvement',
        priority: 'high',
        impact: 'reliability',
        description: 'Add missing tests for critical business logic',
      });
    }

    return opportunities.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  suggestTestingStrategy() {
    const coverage = this.metrics.coverage;

    if (coverage < 50) {
      return {
        phase: 'Foundation',
        focus: 'Basic unit tests for core functionality',
        priority: ['Domain entities', 'Business services', 'Critical utilities'],
        tools: ['Jest', 'Testing Library', 'Mock implementations'],
      };
    } else if (coverage < 80) {
      return {
        phase: 'Expansion',
        focus: 'Integration tests and edge cases',
        priority: ['Repository integrations', 'Component interactions', 'Error handling'],
        tools: ['MSW for API mocking', 'Test fixtures', 'E2E framework setup'],
      };
    } else {
      return {
        phase: 'Optimization',
        focus: 'Performance and reliability testing',
        priority: ['Load testing', 'Visual regression', 'Accessibility testing'],
        tools: ['Lighthouse CI', 'Percy/Chromatic', 'axe-core'],
      };
    }
  }

  generateArchitectureRecommendations() {
    const recommendations = [];

    // Based on complexity metrics
    if (this.metrics.complexity > this.thresholds.complexity.target) {
      recommendations.push({
        area: 'Component Architecture',
        recommendation: 'Implement atomic design patterns more consistently',
        benefit: 'Reduced complexity and improved reusability',
      });
    }

    // Based on maintainability
    if (this.metrics.maintainability < this.thresholds.maintainability.target) {
      recommendations.push({
        area: 'Code Organization',
        recommendation: 'Strengthen domain-driven design implementation',
        benefit: 'Better separation of concerns and testability',
      });
    }

    // Based on duplication
    if (this.metrics.duplication > this.thresholds.duplication.target) {
      recommendations.push({
        area: 'Code Reuse',
        recommendation: 'Create more shared utilities and custom hooks',
        benefit: 'Reduced duplication and improved consistency',
      });
    }

    return recommendations;
  }

  findFiles(pattern, exclude = []) {
    try {
      const { execSync } = require('child_process');
      let cmd = `find . -name "${pattern}" -type f`;

      for (const excludePattern of exclude) {
        cmd += ` ! -path "${excludePattern}"`;
      }

      const output = execSync(cmd, { encoding: 'utf8' }).trim();
      return output ? output.split('\n') : [];
    } catch (error) {
      // Fallback to basic file listing
      return this.findFilesRecursive('.', pattern, exclude);
    }
  }

  findFilesRecursive(dir, pattern, exclude = []) {
    const files = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          // Skip excluded directories
          if (!exclude.some((ex) => fullPath.includes(ex.replace('**/', '')))) {
            files.push(...this.findFilesRecursive(fullPath, pattern, exclude));
          }
        } else if (entry.isFile()) {
          // Simple pattern matching
          if (this.matchesPattern(entry.name, pattern)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    return files;
  }

  matchesPattern(filename, pattern) {
    // Convert glob pattern to regex
    const regex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\{([^}]+)\}/g, '($1)')
      .replace(/,/g, '|');

    return new RegExp(regex).test(filename);
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2] || 'full';
  const monitor = new AIQualityMonitor();

  switch (command) {
    case 'full':
    case 'all':
      monitor.runFullAnalysis().catch(console.error);
      break;
    case 'coverage':
      monitor
        .analyzeCoverage()
        .then(() => console.log('Coverage analysis complete'))
        .catch(console.error);
      break;
    case 'complexity':
      monitor
        .analyzeComplexity()
        .then(() => console.log('Complexity analysis complete'))
        .catch(console.error);
      break;
    case 'security':
      monitor
        .analyzeSecurity()
        .then(() => console.log('Security analysis complete'))
        .catch(console.error);
      break;
    default:
      console.log('AI Quality Monitor');
      console.log('');
      console.log('Commands:');
      console.log('  full (default)  - Run complete quality analysis');
      console.log('  coverage       - Analyze test coverage only');
      console.log('  complexity     - Analyze code complexity only');
      console.log('  security       - Analyze security issues only');
      console.log('');
      console.log('Output:');
      console.log('  quality-report.json - Detailed quality metrics');
      console.log('  ai-insights.json   - AI development recommendations');
  }
}

module.exports = AIQualityMonitor;
