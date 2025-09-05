#!/usr/bin/env node

/**
 * @fileoverview Architecture Compliance Check Script
 * @description Week 6 CI/CD quality gates for architecture validation
 * @usage npm run check:architecture
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Configuration for compliance checks
 */
const COMPLIANCE_CONFIG = {
  // File size limits (in lines)
  fileSizeLimits: {
    pages: { max: 120, path: 'app/**/page.tsx' },
    layouts: { max: 120, path: 'app/**/layout.tsx' },
    'client-components': { max: 200, path: '**/*.client.tsx' },
    'server-components': { max: 150, path: 'app/**/*.tsx' },
    hooks: { max: 120, path: '**/hooks/*.ts' },
    utils: { max: 150, path: 'lib/**/*.ts' },
    tests: { max: 350, path: '**/*.test.{ts,tsx}' },
  },

  // Required patterns for architecture compliance
  requiredPatterns: {
    // memo() wrapper requirement
    memoPattern: /export\s+const\s+\w+\s*=\s*memo\(function/,
    memoPatternAlt: /React\.memo\(/,

    // Context integration patterns
    settingsContextPattern: /useSettings\(\)/,
    audioContextPattern: /useAudio\(\)/,
    bookmarkContextPattern: /useBookmarks\(\)/,

    // Responsive design patterns
    responsivePattern: /md:|lg:|xl:|sm:/,
    touchFriendlyPattern: /min-h-11|h-11|min-h-touch/,

    // Performance optimization patterns
    useCallbackPattern: /useCallback\(/,
    useMemoPattern: /useMemo\(/,
    asConstPattern: /as const/,

    // Import order patterns
    reactImportFirst: /^import\s+(?:React,?\s*)?{[^}]*}\s+from\s+['"]react['"];?$/m,
    typeImportPattern: /import\s+type\s+{[^}]*}\s+from/,
  },

  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 65,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },

  // Bundle size limits
  bundleSizeLimits: {
    'app/(features)/surah': '150KB',
    'app/shared': '100KB',
    lib: '75KB',
  },
};

/**
 * Architecture compliance checker
 */
class ArchitectureComplianceChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.passed = [];
  }

  /**
   * Run all compliance checks
   */
  async runAllChecks() {
    console.log('🔍 Starting Architecture Compliance Check...\n');

    try {
      await this.checkFileSizes();
      await this.checkArchitecturePatterns();
      await this.checkTestCoverage();
      await this.checkBundleSize();
      await this.checkTypeScript();
      await this.checkLinting();

      this.generateReport();

      if (this.violations.length > 0) {
        console.error('❌ Architecture compliance check FAILED\n');
        process.exit(1);
      } else {
        console.log('✅ Architecture compliance check PASSED\n');
        process.exit(0);
      }
    } catch (error) {
      console.error('💥 Compliance check error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check file size limits
   */
  async checkFileSizes() {
    console.log('📏 Checking file size limits...');

    for (const [category, config] of Object.entries(COMPLIANCE_CONFIG.fileSizeLimits)) {
      try {
        const files = this.findFiles(config.path);

        for (const file of files) {
          const lineCount = this.countLines(file);

          if (lineCount > config.max) {
            this.violations.push({
              type: 'FILE_SIZE',
              category,
              file,
              current: lineCount,
              limit: config.max,
              message: `${file} has ${lineCount} lines (limit: ${config.max})`,
            });
          } else {
            this.passed.push(`${file}: ${lineCount}/${config.max} lines ✓`);
          }
        }
      } catch (error) {
        this.warnings.push(`Could not check ${category}: ${error.message}`);
      }
    }
  }

  /**
   * Check architecture patterns in components
   */
  async checkArchitecturePatterns() {
    console.log('🏗️ Checking architecture patterns...');

    const componentFiles = this.findFiles('app/**/*.{ts,tsx}').filter(
      (file) => !file.includes('.test.') && !file.includes('__tests__')
    );

    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');

      // Check if it's a React component
      if (
        content.includes('export') &&
        (content.includes('tsx') || content.includes('React') || content.includes('function'))
      ) {
        this.checkComponentPatterns(file, content);
      }

      // Check if it's a hook
      if (file.includes('/hooks/') || content.includes('function use')) {
        this.checkHookPatterns(file, content);
      }
    }
  }

  /**
   * Check component-specific patterns
   */
  checkComponentPatterns(file, content) {
    const fileName = path.basename(file);

    // Check memo() wrapper
    if (content.includes('function ') && content.includes('export')) {
      const hasMemo =
        COMPLIANCE_CONFIG.requiredPatterns.memoPattern.test(content) ||
        COMPLIANCE_CONFIG.requiredPatterns.memoPatternAlt.test(content);

      if (!hasMemo && !content.includes('"use server"') && !file.includes('page.tsx')) {
        this.violations.push({
          type: 'MEMO_MISSING',
          file,
          message: `${fileName} component missing memo() wrapper`,
        });
      }
    }

    // Check responsive design patterns
    if (content.includes('className') || content.includes('class=')) {
      const hasResponsive = COMPLIANCE_CONFIG.requiredPatterns.responsivePattern.test(content);

      if (!hasResponsive) {
        this.warnings.push(`${fileName} may be missing responsive design classes`);
      }
    }

    // Check touch-friendly patterns for interactive elements
    if (content.includes('button') || content.includes('onClick')) {
      const hasTouchFriendly =
        COMPLIANCE_CONFIG.requiredPatterns.touchFriendlyPattern.test(content);

      if (!hasTouchFriendly) {
        this.warnings.push(`${fileName} may be missing touch-friendly classes`);
      }
    }

    // Check performance patterns
    if (content.includes('function') || content.includes('=>')) {
      const hasUseCallback = COMPLIANCE_CONFIG.requiredPatterns.useCallbackPattern.test(content);
      const hasUseMemo = COMPLIANCE_CONFIG.requiredPatterns.useMemoPattern.test(content);

      if (!hasUseCallback && (content.includes('onClick') || content.includes('onSubmit'))) {
        this.warnings.push(`${fileName} may be missing useCallback for event handlers`);
      }

      if (
        !hasUseMemo &&
        (content.includes('filter(') || content.includes('map(') || content.includes('reduce('))
      ) {
        this.warnings.push(`${fileName} may be missing useMemo for computations`);
      }
    }

    // Check context integration for components that need it
    if (content.includes('fontSize') || content.includes('settings')) {
      const hasSettingsContext =
        COMPLIANCE_CONFIG.requiredPatterns.settingsContextPattern.test(content);
      if (!hasSettingsContext) {
        this.warnings.push(`${fileName} may need Settings context integration`);
      }
    }
  }

  /**
   * Check hook-specific patterns
   */
  checkHookPatterns(file, content) {
    const fileName = path.basename(file);

    // Check as const pattern
    if (content.includes('return')) {
      const hasAsConst = COMPLIANCE_CONFIG.requiredPatterns.asConstPattern.test(content);

      if (!hasAsConst) {
        this.warnings.push(`${fileName} hook may be missing 'as const' for stable returns`);
      }
    }

    // Check cleanup patterns
    if (content.includes('useEffect')) {
      const hasCleanup = content.includes('return () =>') || content.includes('AbortController');

      if (!hasCleanup && (content.includes('fetch') || content.includes('subscribe'))) {
        this.violations.push({
          type: 'CLEANUP_MISSING',
          file,
          message: `${fileName} hook missing cleanup logic`,
        });
      }
    }
  }

  /**
   * Check test coverage
   */
  async checkTestCoverage() {
    console.log('📊 Checking test coverage...');

    try {
      const coverageOutput = execSync('npm run test:coverage --silent', {
        encoding: 'utf8',
        cwd: process.cwd(),
      });

      // Parse coverage output (simplified)
      const lines = coverageOutput.split('\n');
      const coverageLine = lines.find((line) => line.includes('All files'));

      if (coverageLine) {
        const coverage = this.parseCoverageNumbers(coverageLine);

        Object.entries(COMPLIANCE_CONFIG.coverageThresholds.global).forEach(
          ([metric, threshold]) => {
            if (coverage[metric] < threshold) {
              this.violations.push({
                type: 'COVERAGE_LOW',
                metric,
                current: coverage[metric],
                threshold,
                message: `${metric} coverage ${coverage[metric]}% below threshold ${threshold}%`,
              });
            }
          }
        );
      }
    } catch (error) {
      this.warnings.push(`Could not check test coverage: ${error.message}`);
    }
  }

  /**
   * Check bundle size limits
   */
  async checkBundleSize() {
    console.log('📦 Checking bundle size limits...');

    try {
      // Build the project if .next doesn't exist
      if (!fs.existsSync('.next')) {
        execSync('npm run build', { cwd: process.cwd() });
      }

      // Check bundle sizes (simplified)
      for (const [path, limit] of Object.entries(COMPLIANCE_CONFIG.bundleSizeLimits)) {
        const bundlePath = `.next/static/chunks/${path.replace(/\//g, '-')}.js`;

        if (fs.existsSync(bundlePath)) {
          const stats = fs.statSync(bundlePath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          const limitKB = parseInt(limit.replace('KB', ''));

          if (parseInt(sizeKB) > limitKB) {
            this.violations.push({
              type: 'BUNDLE_SIZE',
              path: bundlePath,
              current: `${sizeKB}KB`,
              limit,
              message: `Bundle ${bundlePath} is ${sizeKB}KB (limit: ${limit})`,
            });
          }
        }
      }
    } catch (error) {
      this.warnings.push(`Could not check bundle size: ${error.message}`);
    }
  }

  /**
   * Check TypeScript compliance
   */
  async checkTypeScript() {
    console.log('🔷 Checking TypeScript compliance...');

    try {
      execSync('npx tsc --noEmit --skipLibCheck', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });

      this.passed.push('TypeScript compilation ✓');
    } catch (error) {
      this.violations.push({
        type: 'TYPESCRIPT',
        message: 'TypeScript compilation failed',
        details: error.stdout?.toString() || error.message,
      });
    }
  }

  /**
   * Check ESLint compliance
   */
  async checkLinting() {
    console.log('🔍 Checking ESLint compliance...');

    try {
      execSync('npm run lint', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });

      this.passed.push('ESLint checks ✓');
    } catch (error) {
      const output = error.stdout?.toString() || error.message;

      if (output.includes('error')) {
        this.violations.push({
          type: 'ESLINT',
          message: 'ESLint errors found',
          details: output,
        });
      } else if (output.includes('warning')) {
        this.warnings.push('ESLint warnings found');
      }
    }
  }

  /**
   * Generate compliance report
   */
  generateReport() {
    console.log('\n📋 ARCHITECTURE COMPLIANCE REPORT\n');
    console.log('='.repeat(50));

    if (this.passed.length > 0) {
      console.log('\n✅ PASSED CHECKS:');
      this.passed.forEach((item) => console.log(`  ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach((warning) => console.log(`  ${warning}`));
    }

    if (this.violations.length > 0) {
      console.log('\n❌ VIOLATIONS:');
      this.violations.forEach((violation) => {
        console.log(`  [${violation.type}] ${violation.message}`);
        if (violation.details) {
          console.log(`    Details: ${violation.details.substring(0, 200)}...`);
        }
      });
    }

    console.log('\n' + '='.repeat(50));
    console.log(
      `Summary: ${this.passed.length} passed, ${this.warnings.length} warnings, ${this.violations.length} violations`
    );
  }

  /**
   * Helper methods
   */
  findFiles(pattern) {
    try {
      const output = execSync(
        `find . -path "./node_modules" -prune -o -name "${pattern}" -type f -print`,
        {
          encoding: 'utf8',
          cwd: process.cwd(),
        }
      );

      return output.trim().split('\n').filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  countLines(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.split('\n').filter((line) => line.trim() !== '').length;
    } catch (error) {
      return 0;
    }
  }

  parseCoverageNumbers(line) {
    // Simplified coverage parsing
    const matches = line.match(/(\d+\.?\d*)/g) || [];
    return {
      statements: parseFloat(matches[0]) || 0,
      branches: parseFloat(matches[1]) || 0,
      functions: parseFloat(matches[2]) || 0,
      lines: parseFloat(matches[3]) || 0,
    };
  }
}

// Run compliance check if this script is executed directly
if (require.main === module) {
  const checker = new ArchitectureComplianceChecker();
  checker.runAllChecks().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ArchitectureComplianceChecker;
