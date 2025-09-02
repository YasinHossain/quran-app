#!/usr/bin/env node

/**
 * AI Refactoring Assistant
 *
 * Provides intelligent refactoring suggestions and automated
 * code transformations following the project's architecture.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIRefactoringAssistant {
  constructor() {
    this.refactorings = {
      'extract-component': this.extractComponent.bind(this),
      'extract-hook': this.extractHook.bind(this),
      'extract-domain-service': this.extractDomainService.bind(this),
      'split-large-component': this.splitLargeComponent.bind(this),
      'convert-to-atomic': this.convertToAtomic.bind(this),
      'add-error-boundary': this.addErrorBoundary.bind(this),
      'optimize-performance': this.optimizePerformance.bind(this),
      'improve-accessibility': this.improveAccessibility.bind(this),
    };
  }

  async analyzeFile(filePath) {
    console.log(`🔍 Analyzing ${filePath}...\n`);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const analysis = await this.performAnalysis(filePath, content);

    this.displayAnalysis(analysis);
    return analysis;
  }

  async performAnalysis(filePath, content) {
    const analysis = {
      file: filePath,
      type: this.detectFileType(filePath),
      issues: [],
      suggestions: [],
      metrics: this.calculateMetrics(content),
      dependencies: this.analyzeDependencies(content),
    };

    // Run specific analyses based on file type
    switch (analysis.type) {
      case 'component':
        await this.analyzeComponent(content, analysis);
        break;
      case 'hook':
        await this.analyzeHook(content, analysis);
        break;
      case 'domain':
        await this.analyzeDomainFile(content, analysis);
        break;
      case 'repository':
        await this.analyzeRepository(content, analysis);
        break;
      case 'service':
        await this.analyzeService(content, analysis);
        break;
    }

    return analysis;
  }

  detectFileType(filePath) {
    if (filePath.includes('/components/') && filePath.endsWith('.tsx')) return 'component';
    if (filePath.includes('/hooks/') || filePath.includes('use')) return 'hook';
    if (filePath.includes('src/domain/')) return 'domain';
    if (filePath.includes('Repository.ts')) return 'repository';
    if (filePath.includes('Service.ts')) return 'service';
    return 'unknown';
  }

  calculateMetrics(content) {
    const lines = content.split('\n');
    const codeLines = lines.filter(
      (line) => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*')
    );

    return {
      totalLines: lines.length,
      codeLines: codeLines.length,
      complexity: this.calculateComplexity(content),
      imports: (content.match(/^import/gm) || []).length,
      exports: (content.match(/^export/gm) || []).length,
      functions: (content.match(/function\s+\w+|const\s+\w+\s*=.*=>/g) || []).length,
    };
  }

  calculateComplexity(content) {
    // Simple complexity calculation based on control structures
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s+if/g,
      /switch\s*\(/g,
      /case\s+/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /catch\s*\(/g,
      /\?\s*.*:/g, // ternary
    ];

    let complexity = 1; // base complexity

    for (const pattern of complexityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  analyzeDependencies(content) {
    const imports = [];
    const importMatches = content.matchAll(/import\s+{?([^}]+)}?\s+from\s+['"]([^'"]+)['"]/g);

    for (const match of importMatches) {
      imports.push({
        what: match[1].trim(),
        from: match[2],
      });
    }

    return {
      imports,
      external: imports.filter((imp) => !imp.from.startsWith('.')).length,
      internal: imports.filter((imp) => imp.from.startsWith('.')).length,
    };
  }

  async analyzeComponent(content, analysis) {
    // Check component size
    if (analysis.metrics.codeLines > 200) {
      analysis.issues.push({
        type: 'size',
        severity: 'warning',
        message: 'Component is large (>200 lines). Consider splitting.',
        suggestion: 'split-large-component',
      });
    }

    // Check for multiple responsibilities
    const hooks = (content.match(/use\w+/g) || []).length;
    if (hooks > 8) {
      analysis.issues.push({
        type: 'complexity',
        severity: 'warning',
        message: 'Component uses many hooks. Consider extracting custom hooks.',
        suggestion: 'extract-hook',
      });
    }

    // Check for inline event handlers
    const inlineHandlers = (content.match(/onClick=\{.*=>/g) || []).length;
    if (inlineHandlers > 3) {
      analysis.suggestions.push({
        type: 'performance',
        message: 'Consider extracting inline event handlers to useCallback.',
        suggestion: 'optimize-performance',
      });
    }

    // Check for accessibility issues
    if (content.includes('<button') && !content.includes('aria-')) {
      analysis.suggestions.push({
        type: 'accessibility',
        message: 'Button elements should have ARIA attributes.',
        suggestion: 'improve-accessibility',
      });
    }

    // Check for atomic design compliance
    if (!this.isAtomicComponent(analysis.file)) {
      analysis.suggestions.push({
        type: 'architecture',
        message: 'Component should follow atomic design structure.',
        suggestion: 'convert-to-atomic',
      });
    }

    // Check for error handling
    if (!content.includes('ErrorBoundary') && analysis.metrics.codeLines > 50) {
      analysis.suggestions.push({
        type: 'reliability',
        message: 'Consider adding error boundary for better error handling.',
        suggestion: 'add-error-boundary',
      });
    }
  }

  async analyzeHook(content, analysis) {
    // Check for proper hook structure
    if (!content.includes('export const use') && !content.includes('export function use')) {
      analysis.issues.push({
        type: 'naming',
        severity: 'error',
        message: 'Hook should start with "use" prefix.',
      });
    }

    // Check for business logic in hooks
    if (content.includes('fetch(') || content.includes('.get(') || content.includes('.post(')) {
      analysis.issues.push({
        type: 'architecture',
        severity: 'warning',
        message: 'Hook contains direct API calls. Consider using use cases.',
        suggestion: 'extract-domain-service',
      });
    }
  }

  async analyzeDomainFile(content, analysis) {
    // Check for external dependencies
    const externalImports = analysis.dependencies.imports.filter(
      (imp) => imp.from.includes('react') || imp.from.includes('next/') || imp.from.includes('http')
    );

    if (externalImports.length > 0) {
      analysis.issues.push({
        type: 'architecture',
        severity: 'error',
        message: 'Domain layer should not have external dependencies.',
        details: externalImports.map((imp) => imp.from),
      });
    }

    // Check for business logic
    if (analysis.file.includes('/entities/') && !content.includes('class')) {
      analysis.issues.push({
        type: 'structure',
        severity: 'warning',
        message: 'Entity file should contain a class with business logic.',
      });
    }
  }

  async analyzeRepository(content, analysis) {
    // Check for caching
    if (!content.includes('cache')) {
      analysis.suggestions.push({
        type: 'performance',
        message: 'Repository should implement caching for better performance.',
      });
    }

    // Check for error handling
    if (!content.includes('try') || !content.includes('catch')) {
      analysis.issues.push({
        type: 'reliability',
        severity: 'warning',
        message: 'Repository should have proper error handling.',
      });
    }
  }

  async analyzeService(content, analysis) {
    // Check for dependency injection
    if (!content.includes('@inject') && !content.includes('constructor(')) {
      analysis.suggestions.push({
        type: 'architecture',
        message: 'Service should use dependency injection.',
      });
    }
  }

  isAtomicComponent(filePath) {
    return (
      filePath.includes('/atoms/') ||
      filePath.includes('/molecules/') ||
      filePath.includes('/organisms/') ||
      filePath.includes('/templates/')
    );
  }

  displayAnalysis(analysis) {
    console.log(`📊 Analysis Results for ${path.basename(analysis.file)}\n`);

    // Display metrics
    console.log('📈 Metrics:');
    console.log(`   Lines of code: ${analysis.metrics.codeLines}`);
    console.log(`   Complexity: ${analysis.metrics.complexity}`);
    console.log(`   Functions: ${analysis.metrics.functions}`);
    console.log(
      `   Imports: ${analysis.dependencies.external} external, ${analysis.dependencies.internal} internal\n`
    );

    // Display issues
    if (analysis.issues.length > 0) {
      console.log('🚨 Issues:');
      analysis.issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. [${issue.severity.toUpperCase()}] ${issue.message}`);
        if (issue.details) {
          issue.details.forEach((detail) => console.log(`      - ${detail}`));
        }
      });
      console.log('');
    }

    // Display suggestions
    if (analysis.suggestions.length > 0) {
      console.log('💡 Suggestions:');
      analysis.suggestions.forEach((suggestion, i) => {
        console.log(`   ${i + 1}. ${suggestion.message}`);
        if (suggestion.suggestion) {
          console.log(`      → Use: npm run refactor -- ${suggestion.suggestion} ${analysis.file}`);
        }
      });
      console.log('');
    }

    if (analysis.issues.length === 0 && analysis.suggestions.length === 0) {
      console.log('✅ No issues or suggestions found! Code looks good.\n');
    }
  }

  async applyRefactoring(type, filePath, options = {}) {
    console.log(`🔧 Applying ${type} refactoring to ${filePath}...\n`);

    if (!this.refactorings[type]) {
      console.error(`Unknown refactoring type: ${type}`);
      return;
    }

    try {
      await this.refactorings[type](filePath, options);
      console.log(`✅ Refactoring "${type}" completed successfully!`);
    } catch (error) {
      console.error(`❌ Refactoring failed:`, error.message);
    }
  }

  // Refactoring implementations
  async extractComponent(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Simple extraction: find JSX elements that could be components
    const jsxElements = this.findExtractableJSX(content);

    if (jsxElements.length === 0) {
      console.log('No extractable components found.');
      return;
    }

    console.log('Extractable components:');
    jsxElements.forEach((element, i) => {
      console.log(`   ${i + 1}. ${element.name} (${element.lines} lines)`);
    });

    // For now, just suggest what could be extracted
    console.log('\nTo extract, create new component files and move the JSX.');
  }

  async extractHook(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find useState, useEffect patterns that could be extracted
    const hookPatterns = this.findExtractableHooks(content);

    if (hookPatterns.length === 0) {
      console.log('No extractable hooks found.');
      return;
    }

    console.log('Extractable hook patterns:');
    hookPatterns.forEach((pattern, i) => {
      console.log(`   ${i + 1}. ${pattern.type}: ${pattern.description}`);
    });
  }

  async extractDomainService(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find API calls and business logic that should be in domain layer
    const businessLogic = this.findBusinessLogic(content);

    if (businessLogic.length === 0) {
      console.log('No business logic to extract found.');
      return;
    }

    console.log('Business logic to extract:');
    businessLogic.forEach((logic, i) => {
      console.log(`   ${i + 1}. ${logic.type}: ${logic.description}`);
    });
  }

  async splitLargeComponent(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');
    const analysis = await this.performAnalysis(filePath, content);

    if (analysis.metrics.codeLines < 100) {
      console.log('Component is not large enough to warrant splitting.');
      return;
    }

    console.log('Component splitting suggestions:');
    console.log('1. Extract repetitive JSX into smaller components');
    console.log('2. Move complex logic into custom hooks');
    console.log('3. Split into atomic design components (atoms/molecules)');
    console.log('4. Extract business logic into domain services');
  }

  async convertToAtomic(filePath, options) {
    const componentName = path.basename(filePath, '.tsx');
    const currentDir = path.dirname(filePath);

    console.log(`Converting ${componentName} to atomic design structure:`);
    console.log(`Current location: ${currentDir}`);

    // Determine atomic level based on complexity
    const content = fs.readFileSync(filePath, 'utf8');
    const analysis = await this.performAnalysis(filePath, content);

    let atomicLevel = 'molecules';
    if (analysis.metrics.codeLines < 50) atomicLevel = 'atoms';
    if (analysis.metrics.codeLines > 150) atomicLevel = 'organisms';

    console.log(`Suggested atomic level: ${atomicLevel}`);
    console.log(`Move to: ${currentDir.replace(/components.*/, `components/${atomicLevel}`)}`);
  }

  async addErrorBoundary(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if already has error boundary
    if (content.includes('ErrorBoundary')) {
      console.log('Component already has error boundary.');
      return;
    }

    const errorBoundaryCode = `
// Add this import
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

// Wrap your component JSX with:
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  {/* Your existing component content */}
</ErrorBoundary>`;

    console.log('Add error boundary:');
    console.log(errorBoundaryCode);
  }

  async optimizePerformance(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');
    const optimizations = [];

    // Check for missing React.memo
    if (!content.includes('React.memo') && content.includes('React.FC')) {
      optimizations.push('Wrap component with React.memo for prop-based memoization');
    }

    // Check for inline functions
    if (content.includes('onClick={') && content.includes('=>')) {
      optimizations.push('Extract inline event handlers to useCallback');
    }

    // Check for expensive calculations
    if (content.includes('.map(') || content.includes('.filter(')) {
      optimizations.push('Consider using useMemo for expensive array operations');
    }

    console.log('Performance optimizations:');
    optimizations.forEach((opt, i) => {
      console.log(`   ${i + 1}. ${opt}`);
    });
  }

  async improveAccessibility(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8');
    const improvements = [];

    // Check for missing ARIA attributes
    if (content.includes('<button') && !content.includes('aria-')) {
      improvements.push('Add aria-label or aria-describedby to buttons');
    }

    if (content.includes('<input') && !content.includes('aria-')) {
      improvements.push('Add aria-label or associate with label element');
    }

    // Check for missing semantic HTML
    if (!content.includes('<main>') && !content.includes('<section>')) {
      improvements.push('Use semantic HTML elements (main, section, nav, etc.)');
    }

    console.log('Accessibility improvements:');
    improvements.forEach((imp, i) => {
      console.log(`   ${i + 1}. ${imp}`);
    });
  }

  // Helper methods for finding extractable patterns
  findExtractableJSX(content) {
    // Simple pattern matching for repetitive JSX
    const elements = [];

    // Look for repeated patterns (simplified)
    const divMatches = content.match(/<div[^>]*>[\s\S]*?<\/div>/g) || [];

    divMatches.forEach((match) => {
      if (match.length > 200) {
        // Large JSX blocks
        elements.push({
          name: 'ExtractedComponent',
          lines: match.split('\n').length,
          content: match.substring(0, 100) + '...',
        });
      }
    });

    return elements;
  }

  findExtractableHooks(content) {
    const patterns = [];

    // Look for useState + useEffect patterns
    if (content.includes('useState') && content.includes('useEffect')) {
      patterns.push({
        type: 'State Management Hook',
        description: 'useState + useEffect pattern can be extracted to custom hook',
      });
    }

    // Look for API calls
    if (content.includes('fetch(') || content.includes('.get(')) {
      patterns.push({
        type: 'Data Fetching Hook',
        description: 'API calls can be extracted to data fetching hook',
      });
    }

    return patterns;
  }

  findBusinessLogic(content) {
    const logic = [];

    // Look for API calls
    if (content.includes('fetch(') || content.includes('.post(') || content.includes('.get(')) {
      logic.push({
        type: 'API Operations',
        description: 'API calls should be moved to repository layer',
      });
    }

    // Look for validation logic
    if (content.includes('validate') || content.includes('isValid')) {
      logic.push({
        type: 'Validation Logic',
        description: 'Validation logic should be moved to domain entities',
      });
    }

    // Look for business calculations
    if (content.includes('calculate') || content.includes('compute')) {
      logic.push({
        type: 'Business Calculations',
        description: 'Business calculations should be moved to domain services',
      });
    }

    return logic;
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const targetFile = process.argv[3];
  const options = {};

  const assistant = new AIRefactoringAssistant();

  if (command === 'analyze') {
    if (!targetFile) {
      console.log('Usage: node refactoring-assistant.js analyze <file-path>');
      process.exit(1);
    }
    assistant.analyzeFile(targetFile).catch(console.error);
  } else if (command === 'refactor') {
    const refactorType = process.argv[3];
    const refactorFile = process.argv[4];

    if (!refactorType || !refactorFile) {
      console.log('Usage: node refactoring-assistant.js refactor <type> <file-path>');
      console.log('Available types:', Object.keys(assistant.refactorings).join(', '));
      process.exit(1);
    }

    assistant.applyRefactoring(refactorType, refactorFile, options).catch(console.error);
  } else {
    console.log('AI Refactoring Assistant');
    console.log('');
    console.log('Commands:');
    console.log('  analyze <file>           - Analyze file for refactoring opportunities');
    console.log('  refactor <type> <file>   - Apply specific refactoring');
    console.log('');
    console.log('Available refactoring types:');
    console.log('  extract-component        - Extract reusable components');
    console.log('  extract-hook            - Extract custom hooks');
    console.log('  extract-domain-service  - Move business logic to domain');
    console.log('  split-large-component   - Split large components');
    console.log('  convert-to-atomic       - Convert to atomic design');
    console.log('  add-error-boundary      - Add error handling');
    console.log('  optimize-performance    - Performance optimizations');
    console.log('  improve-accessibility   - Accessibility improvements');
    console.log('');
    console.log('Examples:');
    console.log('  node refactoring-assistant.js analyze src/components/LargeComponent.tsx');
    console.log(
      '  node refactoring-assistant.js refactor extract-hook src/components/MyComponent.tsx'
    );
  }
}

module.exports = AIRefactoringAssistant;
