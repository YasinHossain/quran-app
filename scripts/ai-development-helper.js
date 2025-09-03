#!/usr/bin/env node

/**
 * AI Development Helper Script - Week 7
 * 
 * Provides AI assistants with quick access to architecture patterns,
 * validation tools, and compliance checking for development tasks.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class AIDevHelper {
  constructor() {
    this.rootDir = process.cwd();
    this.aiDir = path.join(this.rootDir, '.ai');
    this.templatesDir = path.join(this.rootDir, 'templates', 'ai-compliant');
  }

  // Main CLI interface
  run() {
    const command = process.argv[2];
    
    console.log(`${colors.cyan}${colors.bright}🤖 AI Development Helper - Week 7${colors.reset}\n`);

    switch (command) {
      case 'validate':
        this.validateArchitecture();
        break;
      case 'patterns':
        this.showPatterns();
        break;
      case 'context':
        this.showContext();
        break;
      case 'templates':
        this.listTemplates();
        break;
      case 'checklist':
        this.showChecklist();
        break;
      case 'quality':
        this.runQualityChecks();
        break;
      case 'help':
      default:
        this.showHelp();
        break;
    }
  }

  // Show help information
  showHelp() {
    console.log(`${colors.bright}AI Development Helper Commands:${colors.reset}
    
${colors.yellow}validate${colors.reset}   - Check architecture compliance of current codebase
${colors.yellow}patterns${colors.reset}   - Display mandatory architecture patterns
${colors.yellow}context${colors.reset}    - Show AI development context
${colors.yellow}templates${colors.reset}  - List available architecture-compliant templates
${colors.yellow}checklist${colors.reset} - Display architecture compliance checklist
${colors.yellow}quality${colors.reset}   - Run all quality checks and validation
${colors.yellow}help${colors.reset}      - Show this help message

${colors.bright}Examples:${colors.reset}
  node scripts/ai-development-helper.js validate
  node scripts/ai-development-helper.js patterns
  node scripts/ai-development-helper.js quality

${colors.bright}For AI Assistants:${colors.reset}
  Always run 'validate' before making changes
  Use 'patterns' to understand required patterns
  Run 'quality' after implementation to verify compliance
`);
  }

  // Validate architecture compliance
  validateArchitecture() {
    console.log(`${colors.bright}🔍 Architecture Compliance Validation${colors.reset}\n`);

    try {
      // Check if required files exist
      this.checkRequiredFiles();
      
      // Run architecture-specific checks
      this.checkComponentPatterns();
      this.checkHookPatterns();
      this.checkTestPatterns();
      
      console.log(`${colors.green}✅ Architecture validation completed${colors.reset}\n`);
      
    } catch (error) {
      console.error(`${colors.red}❌ Architecture validation failed: ${error.message}${colors.reset}\n`);
      process.exit(1);
    }
  }

  // Check required files exist
  checkRequiredFiles() {
    const requiredFiles = [
      'ARCHITECTURE_GUIDELINES.md',
      '.ai/context.md',
      'templates/ai-compliant/component.template.tsx',
      'templates/ai-compliant/hook.template.ts',
      'templates/ai-compliant/test.template.test.tsx'
    ];

    console.log(`${colors.bright}Checking required files...${colors.reset}`);

    requiredFiles.forEach(file => {
      const filePath = path.join(this.rootDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`  ${colors.green}✓${colors.reset} ${file}`);
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${file} - MISSING`);
        throw new Error(`Required file missing: ${file}`);
      }
    });

    console.log();
  }

  // Check component patterns
  checkComponentPatterns() {
    console.log(`${colors.bright}Checking component patterns...${colors.reset}`);
    
    // Find all .tsx files in app directory
    const componentFiles = this.findFiles('app/**/*.tsx', ['**/*.test.tsx']);
    
    let violations = 0;
    
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const fileName = path.relative(this.rootDir, file);
      
      // Check for memo() wrapper
      if (!content.includes('memo(function') && !content.includes('memo(')) {
        console.log(`  ${colors.red}✗${colors.reset} ${fileName} - Missing memo() wrapper`);
        violations++;
      }
      
      // Check for mobile-first responsive patterns
      if (!content.includes('md:') && content.includes('className')) {
        console.log(`  ${colors.yellow}⚠${colors.reset} ${fileName} - No responsive design patterns found`);
      }
      
      // Check for context integration (basic check)
      if (content.includes('useSettings') || content.includes('useAudio') || content.includes('useBookmarks')) {
        console.log(`  ${colors.green}✓${colors.reset} ${fileName} - Context integration found`);
      }
    });

    if (violations === 0) {
      console.log(`  ${colors.green}✅ All components follow memo() pattern${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌ Found ${violations} memo() violations${colors.reset}`);
    }
    
    console.log();
  }

  // Check hook patterns
  checkHookPatterns() {
    console.log(`${colors.bright}Checking hook patterns...${colors.reset}`);
    
    // Find all custom hook files
    const hookFiles = this.findFiles('app/**/*use*.ts', ['**/*.test.ts']);
    
    let violations = 0;
    
    hookFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const fileName = path.relative(this.rootDir, file);
      
      // Check for 'as const' return pattern
      if (content.includes('return {') && !content.includes('} as const')) {
        console.log(`  ${colors.red}✗${colors.reset} ${fileName} - Missing 'as const' in return`);
        violations++;
      }
      
      // Check for useCallback/useMemo usage
      if (content.includes('useCallback') || content.includes('useMemo')) {
        console.log(`  ${colors.green}✓${colors.reset} ${fileName} - Performance optimizations found`);
      }
    });

    if (violations === 0) {
      console.log(`  ${colors.green}✅ All hooks follow 'as const' pattern${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌ Found ${violations} 'as const' violations${colors.reset}`);
    }
    
    console.log();
  }

  // Check test patterns
  checkTestPatterns() {
    console.log(`${colors.bright}Checking test patterns...${colors.reset}`);
    
    // Find all test files
    const testFiles = this.findFiles('**/*.test.{ts,tsx}');
    
    let violations = 0;
    
    testFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const fileName = path.relative(this.rootDir, file);
      
      // Check for provider wrapper
      if (content.includes('render(') && !content.includes('Provider')) {
        console.log(`  ${colors.red}✗${colors.reset} ${fileName} - Missing provider wrapper`);
        violations++;
      }
      
      // Check for responsive testing
      if (content.includes('toHaveClass') && content.includes('md:')) {
        console.log(`  ${colors.green}✓${colors.reset} ${fileName} - Responsive design testing found`);
      }
    });

    if (violations === 0) {
      console.log(`  ${colors.green}✅ All tests use provider wrappers${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌ Found ${violations} provider wrapper violations${colors.reset}`);
    }
    
    console.log();
  }

  // Show mandatory architecture patterns
  showPatterns() {
    console.log(`${colors.bright}📋 Mandatory Architecture Patterns${colors.reset}\n`);

    console.log(`${colors.cyan}1. Component Pattern (REQUIRED):${colors.reset}
${colors.yellow}import { memo, useCallback, useMemo } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';

export const MyComponent = memo(function MyComponent(props) {
  const { settings } = useSettings();
  
  const memoizedValue = useMemo(() => compute(props), [props]);
  const memoizedCallback = useCallback(() => {}, []);
  
  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <button className="h-11 px-4 touch-manipulation">
        Action
      </button>
    </div>
  );
});${colors.reset}

${colors.cyan}2. Hook Pattern (REQUIRED):${colors.reset}
${colors.yellow}export function useMyHook({ id }) {
  const [data, setData] = useState(null);
  
  const processedData = useMemo(() => {
    return transformData(data);
  }, [data]);
  
  return { data: processedData } as const;
}${colors.reset}

${colors.cyan}3. Test Pattern (REQUIRED):${colors.reset}
${colors.yellow}const TestWrapper = ({ children }) => (
  <SettingsProvider>
    <AudioProvider>
      {children}
    </AudioProvider>
  </SettingsProvider>
);

describe('Component', () => {
  it('renders with compliance', () => {
    render(<Component />, { wrapper: TestWrapper });
  });
});${colors.reset}
`);
  }

  // Show AI context information
  showContext() {
    console.log(`${colors.bright}📚 AI Development Context${colors.reset}\n`);
    
    const contextFile = path.join(this.aiDir, 'context.md');
    if (fs.existsSync(contextFile)) {
      const context = fs.readFileSync(contextFile, 'utf8');
      console.log(context.substring(0, 500) + '...\n');
      console.log(`${colors.blue}📖 Full context available at: ${contextFile}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Context file not found: ${contextFile}${colors.reset}`);
    }
  }

  // List available templates
  listTemplates() {
    console.log(`${colors.bright}📄 Available Architecture-Compliant Templates${colors.reset}\n`);
    
    if (fs.existsSync(this.templatesDir)) {
      const templates = fs.readdirSync(this.templatesDir);
      
      templates.forEach(template => {
        const templatePath = path.join(this.templatesDir, template);
        const stats = fs.statSync(templatePath);
        
        if (stats.isFile()) {
          console.log(`  ${colors.green}📄${colors.reset} ${template}`);
          console.log(`     ${colors.blue}${templatePath}${colors.reset}`);
        }
      });
    } else {
      console.log(`${colors.red}❌ Templates directory not found: ${this.templatesDir}${colors.reset}`);
    }
    
    console.log();
  }

  // Show architecture compliance checklist
  showChecklist() {
    console.log(`${colors.bright}✅ Architecture Compliance Checklist${colors.reset}\n`);
    
    console.log(`${colors.cyan}Pre-Development (MANDATORY):${colors.reset}
  ${colors.yellow}□${colors.reset} Read ARCHITECTURE_GUIDELINES.md
  ${colors.yellow}□${colors.reset} Read relevant AGENTS.md files
  ${colors.yellow}□${colors.reset} Understand established patterns
  ${colors.yellow}□${colors.reset} Plan architecture-compliant solution

${colors.cyan}Implementation (REQUIRED):${colors.reset}
  ${colors.yellow}□${colors.reset} memo() wrapper on ALL components
  ${colors.yellow}□${colors.reset} Mobile-first responsive design
  ${colors.yellow}□${colors.reset} Context integration where needed
  ${colors.yellow}□${colors.reset} Performance optimization (useCallback, useMemo)
  ${colors.yellow}□${colors.reset} TypeScript interfaces and proper typing
  ${colors.yellow}□${colors.reset} Touch-friendly interactions (44px targets)

${colors.cyan}Testing (MANDATORY):${colors.reset}
  ${colors.yellow}□${colors.reset} Provider wrappers in ALL tests
  ${colors.yellow}□${colors.reset} Responsive design validation
  ${colors.yellow}□${colors.reset} Context integration testing
  ${colors.yellow}□${colors.reset} Architecture compliance verification

${colors.cyan}Validation (REQUIRED):${colors.reset}
  ${colors.yellow}□${colors.reset} npm run check passes
  ${colors.yellow}□${colors.reset} npm run test:architecture passes
  ${colors.yellow}□${colors.reset} npm run test:responsive passes
  ${colors.yellow}□${colors.reset} No functionality regressions
`);
  }

  // Run all quality checks
  runQualityChecks() {
    console.log(`${colors.bright}🚀 Running Quality Checks${colors.reset}\n`);
    
    const commands = [
      'npm run check',
      'npm run test:architecture',
      'npm run test:responsive',
      'npm run check:architecture'
    ];

    commands.forEach(command => {
      console.log(`${colors.cyan}Running: ${command}${colors.reset}`);
      
      try {
        execSync(command, { stdio: 'inherit' });
        console.log(`${colors.green}✅ ${command} passed${colors.reset}\n`);
      } catch (error) {
        console.log(`${colors.red}❌ ${command} failed${colors.reset}\n`);
      }
    });
  }

  // Helper function to find files using basic glob pattern
  findFiles(pattern, exclude = []) {
    const files = [];
    const searchDir = pattern.includes('app/') ? 'app' : '.';
    const extension = pattern.includes('.tsx') ? '.tsx' : '.ts';
    
    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith(extension)) {
          const relativePath = path.relative(this.rootDir, fullPath);
          
          // Check exclusions
          const shouldExclude = exclude.some(pattern => {
            return relativePath.includes(pattern.replace('**/', ''));
          });
          
          if (!shouldExclude) {
            files.push(fullPath);
          }
        }
      });
    };
    
    walkDir(searchDir);
    return files;
  }
}

// Run the CLI
const helper = new AIDevHelper();
helper.run();