#!/usr/bin/env node

/**
 * Pre-commit AI Check Hook
 *
 * This script runs before git commits to provide AI-readable analysis
 * of changes and suggest improvements or catch potential issues.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PreCommitAICheck {
  constructor() {
    this.changedFiles = [];
    this.issues = [];
    this.suggestions = [];
  }

  async run() {
    console.log('🤖 Running AI Pre-commit Checks...\n');

    try {
      await this.getChangedFiles();
      await this.analyzeChanges();
      await this.generateReport();

      if (this.issues.length > 0) {
        console.log('❌ Pre-commit check failed. Please address the issues above.');
        process.exit(1);
      } else {
        console.log('✅ Pre-commit checks passed!');
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Pre-commit check error:', error.message);
      process.exit(1);
    }
  }

  async getChangedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      this.changedFiles = output.trim().split('\n').filter(Boolean);
      console.log(`📁 Analyzing ${this.changedFiles.length} changed files`);
    } catch (error) {
      throw new Error('Failed to get changed files');
    }
  }

  async analyzeChanges() {
    for (const file of this.changedFiles) {
      if (!fs.existsSync(file)) continue;

      const analysis = await this.analyzeFile(file);
      if (analysis.issues.length > 0) {
        this.issues.push(...analysis.issues);
      }
      if (analysis.suggestions.length > 0) {
        this.suggestions.push(...analysis.suggestions);
      }
    }
  }

  async analyzeFile(filePath) {
    const analysis = { issues: [], suggestions: [] };
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    // TypeScript/JavaScript Analysis
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      await this.analyzeTypeScriptFile(filePath, content, analysis);
    }

    // Test File Analysis
    if (filePath.includes('.test.') || filePath.includes('__tests__')) {
      await this.analyzeTestFile(filePath, content, analysis);
    }

    // Component Analysis
    if (filePath.includes('/components/') && ext === '.tsx') {
      await this.analyzeComponent(filePath, content, analysis);
    }

    // Domain Layer Analysis
    if (filePath.includes('src/domain/')) {
      await this.analyzeDomainFile(filePath, content, analysis);
    }

    return analysis;
  }

  async analyzeTypeScriptFile(filePath, content, analysis) {
    // Check for any types
    if (content.includes(': any')) {
      analysis.issues.push({
        file: filePath,
        type: 'TypeScript',
        message: 'Contains "any" type - should use specific types',
        severity: 'warning',
      });
    }

    // Check for console.log in non-dev files
    if (
      content.includes('console.log') &&
      !filePath.includes('/tools/') &&
      !filePath.includes('.test.')
    ) {
      analysis.issues.push({
        file: filePath,
        type: 'Debug',
        message: 'Contains console.log - remove before committing',
        severity: 'error',
      });
    }

    // Check for TODO comments
    if (content.includes('TODO') || content.includes('FIXME')) {
      analysis.suggestions.push({
        file: filePath,
        type: 'Maintenance',
        message: 'Contains TODO/FIXME comments - consider addressing or creating issues',
        severity: 'info',
      });
    }

    // Check for proper error handling
    if (content.includes('catch') && !content.includes('throw')) {
      analysis.suggestions.push({
        file: filePath,
        type: 'Error Handling',
        message: 'Catch block without proper error handling - consider logging or re-throwing',
        severity: 'warning',
      });
    }
  }

  async analyzeTestFile(filePath, content, analysis) {
    // Check for test descriptions
    if (!content.includes('describe(') && !content.includes('it(')) {
      analysis.issues.push({
        file: filePath,
        type: 'Testing',
        message: 'Test file without proper describe/it blocks',
        severity: 'error',
      });
    }

    // Check for proper assertions
    if (!content.includes('expect(')) {
      analysis.issues.push({
        file: filePath,
        type: 'Testing',
        message: 'Test file without assertions',
        severity: 'error',
      });
    }

    // Check for provider wrapping in component tests
    if (filePath.includes('/components/') && !content.includes('Provider')) {
      analysis.suggestions.push({
        file: filePath,
        type: 'Testing',
        message: 'Component test may need provider wrappers - check component dependencies',
        severity: 'info',
      });
    }
  }

  async analyzeComponent(filePath, content, analysis) {
    // Check for proper TypeScript props interface
    if (!content.includes('interface') && !content.includes('type')) {
      analysis.issues.push({
        file: filePath,
        type: 'Component',
        message: 'Component missing TypeScript props interface',
        severity: 'warning',
      });
    }

    // Check for responsive design patterns
    if (
      content.includes('className') &&
      !content.includes('sm:') &&
      !content.includes('md:') &&
      !content.includes('lg:')
    ) {
      analysis.suggestions.push({
        file: filePath,
        type: 'Responsive Design',
        message: 'Component may need responsive design classes (sm:, md:, lg:)',
        severity: 'info',
      });
    }

    // Check for accessibility
    if (content.includes('<button') && !content.includes('aria-')) {
      analysis.suggestions.push({
        file: filePath,
        type: 'Accessibility',
        message: 'Button component may need ARIA attributes for accessibility',
        severity: 'info',
      });
    }

    // Check for proper memo usage for performance
    if (
      content.includes('React.FC') &&
      !content.includes('React.memo') &&
      filePath.includes('/organisms/')
    ) {
      analysis.suggestions.push({
        file: filePath,
        type: 'Performance',
        message: 'Complex organism component may benefit from React.memo',
        severity: 'info',
      });
    }
  }

  async analyzeDomainFile(filePath, content, analysis) {
    // Check for business logic in domain entities
    if (filePath.includes('/entities/') && !content.includes('class')) {
      analysis.issues.push({
        file: filePath,
        type: 'Domain Design',
        message: 'Entity file should contain a class with business logic',
        severity: 'warning',
      });
    }

    // Check for external dependencies in domain
    if (content.includes('import.*from.*http') || content.includes('fetch(')) {
      analysis.issues.push({
        file: filePath,
        type: 'Clean Architecture',
        message: 'Domain layer should not have external dependencies (API calls, HTTP)',
        severity: 'error',
      });
    }

    // Check for UI imports in domain
    if (content.includes('react') || content.includes('next/')) {
      analysis.issues.push({
        file: filePath,
        type: 'Clean Architecture',
        message: 'Domain layer should not import UI framework code',
        severity: 'error',
      });
    }
  }

  async generateReport() {
    console.log('\n📊 Analysis Report:\n');

    if (this.issues.length === 0 && this.suggestions.length === 0) {
      console.log('🎉 No issues or suggestions found!');
      return;
    }

    // Group issues by type
    const issuesByType = this.groupByType(this.issues);
    const suggestionsByType = this.groupByType(this.suggestions);

    // Print issues
    if (this.issues.length > 0) {
      console.log('🚨 Issues (must fix):');
      for (const [type, items] of Object.entries(issuesByType)) {
        console.log(`\n  ${type}:`);
        items.forEach((item) => {
          console.log(`    • ${item.file}: ${item.message}`);
        });
      }
    }

    // Print suggestions
    if (this.suggestions.length > 0) {
      console.log('\n💡 Suggestions (consider addressing):');
      for (const [type, items] of Object.entries(suggestionsByType)) {
        console.log(`\n  ${type}:`);
        items.forEach((item) => {
          console.log(`    • ${item.file}: ${item.message}`);
        });
      }
    }

    // AI-specific recommendations
    console.log('\n🤖 AI Development Recommendations:');
    console.log('  • Run "npm run check" to ensure all quality checks pass');
    console.log(
      '  • Use the component registry (docs/ai/component-registry.md) for similar patterns'
    );
    console.log('  • Check .ai files in each directory for context-specific guidelines');

    if (this.changedFiles.some((f) => f.includes('/domain/'))) {
      console.log('  • Domain changes detected - ensure business logic tests are updated');
    }

    if (this.changedFiles.some((f) => f.includes('.tsx'))) {
      console.log(
        '  • Component changes detected - test responsive design on multiple breakpoints'
      );
    }
  }

  groupByType(items) {
    return items.reduce((groups, item) => {
      const type = item.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
      return groups;
    }, {});
  }
}

// Run the pre-commit check
if (require.main === module) {
  const checker = new PreCommitAICheck();
  checker.run().catch(console.error);
}

module.exports = PreCommitAICheck;
