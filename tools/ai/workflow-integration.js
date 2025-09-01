#!/usr/bin/env node

/**
 * AI Workflow Integration
 * 
 * Integrates all AI workflow enhancements into the development process
 * and provides a unified interface for AI-assisted development.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIWorkflowIntegration {
  constructor() {
    this.tools = {
      'pre-commit-check': './tools/ai/pre-commit-ai-check.js',
      'test-generator': './tools/ai/test-generator.js',
      'doc-updater': './tools/ai/doc-updater.js',
      'feature-generator': './tools/ai/feature-generator.js',
      'refactoring-assistant': './tools/ai/refactoring-assistant.js',
      'platform-generator': './tools/ai/platform-generator.js',
      'quality-monitor': './tools/ai/quality-monitor.js'
    };

    this.documentation = {
      'component-registry': './docs/ai/component-registry.md',
      'architecture-map': './docs/ai/architecture-map.md',
      'search-patterns': './docs/ai/search-patterns.md',
      'multi-platform-guide': './docs/ai/multi-platform-guide.md'
    };

    this.contextFiles = [
      './app/.ai',
      './src/.ai',
      './lib/.ai',
      './types/.ai',
      './tests/.ai'
    ];
  }

  async initialize() {
    console.log('🤖 Initializing AI Workflow Integration...\n');

    try {
      await this.validateEnvironment();
      await this.setupGitHooks();
      await this.updatePackageScripts();
      await this.createWorkflowCommands();
      await this.generateUsageGuide();
      
      console.log('✅ AI Workflow Integration complete!\n');
      this.displayQuickStart();
      
    } catch (error) {
      console.error('❌ Integration failed:', error.message);
      process.exit(1);
    }
  }

  async validateEnvironment() {
    console.log('🔍 Validating environment...');

    // Check if all tools exist
    const missingTools = [];
    for (const [name, path] of Object.entries(this.tools)) {
      if (!fs.existsSync(path)) {
        missingTools.push(`${name}: ${path}`);
      }
    }

    if (missingTools.length > 0) {
      throw new Error(`Missing AI tools:\n${missingTools.join('\n')}`);
    }

    // Check documentation
    const missingDocs = [];
    for (const [name, path] of Object.entries(this.documentation)) {
      if (!fs.existsSync(path)) {
        missingDocs.push(`${name}: ${path}`);
      }
    }

    if (missingDocs.length > 0) {
      throw new Error(`Missing documentation:\n${missingDocs.join('\n')}`);
    }

    // Check context files
    const missingContext = this.contextFiles.filter(file => !fs.existsSync(file));
    if (missingContext.length > 0) {
      console.warn('⚠️  Missing context files:', missingContext.join(', '));
    }

    console.log('   Environment validation passed');
  }

  async setupGitHooks() {
    console.log('🔗 Setting up Git hooks...');

    const hooksDir = '.git/hooks';
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Pre-commit hook
    const preCommitHook = `#!/bin/sh
# AI-Enhanced Pre-commit Hook
node tools/ai/pre-commit-ai-check.js

if [ $? -ne 0 ]; then
  echo "❌ Pre-commit AI check failed. Please address the issues above."
  exit 1
fi

echo "✅ Pre-commit AI checks passed!"
`;

    fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook);
    execSync(`chmod +x ${path.join(hooksDir, 'pre-commit')}`);

    // Post-commit hook for documentation updates
    const postCommitHook = `#!/bin/sh
# AI Documentation Update Hook
node tools/ai/doc-updater.js >/dev/null 2>&1 &
`;

    fs.writeFileSync(path.join(hooksDir, 'post-commit'), postCommitHook);
    execSync(`chmod +x ${path.join(hooksDir, 'post-commit')}`);

    console.log('   Git hooks configured');
  }

  async updatePackageScripts() {
    console.log('📦 Updating package.json scripts...');

    const packageJsonPath = 'package.json';
    if (!fs.existsSync(packageJsonPath)) {
      console.warn('   package.json not found, skipping script updates');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add AI workflow scripts
    packageJson.scripts = packageJson.scripts || {};
    
    const aiScripts = {
      // Analysis and monitoring
      'ai:quality': 'node tools/ai/quality-monitor.js',
      'ai:analyze': 'node tools/ai/refactoring-assistant.js analyze',
      
      // Generation and automation
      'ai:feature': 'node tools/ai/feature-generator.js',
      'ai:tests': 'node tools/ai/test-generator.js',
      'ai:platform': 'node tools/ai/platform-generator.js',
      
      // Documentation and maintenance
      'ai:docs': 'node tools/ai/doc-updater.js',
      'ai:refactor': 'node tools/ai/refactoring-assistant.js refactor',
      
      // Workflow commands
      'ai:check': 'node tools/ai/pre-commit-ai-check.js',
      'ai:workflow': 'node tools/ai/workflow-integration.js help'
    };

    Object.assign(packageJson.scripts, aiScripts);

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('   Package scripts updated');
  }

  async createWorkflowCommands() {
    console.log('⚙️ Creating workflow commands...');

    const workflowScript = `#!/bin/bash

# AI Workflow Helper Script
# Provides quick access to AI development tools

case "$1" in
  "setup")
    echo "🚀 Setting up AI workflow..."
    node tools/ai/workflow-integration.js
    ;;
  "analyze")
    echo "🔍 Running code analysis..."
    npm run ai:analyze "$2"
    ;;
  "quality")
    echo "📊 Running quality check..."
    npm run ai:quality
    ;;
  "feature")
    if [ -z "$2" ]; then
      echo "Usage: ./ai-workflow.sh feature <feature-name>"
      exit 1
    fi
    echo "✨ Generating feature: $2"
    npm run ai:feature "$2"
    ;;
  "test")
    if [ -z "$2" ]; then
      echo "Usage: ./ai-workflow.sh test <file-path>"
      exit 1
    fi
    echo "🧪 Generating tests for: $2"
    npm run ai:tests "$2"
    ;;
  "refactor")
    if [ -z "$2" ] || [ -z "$3" ]; then
      echo "Usage: ./ai-workflow.sh refactor <type> <file-path>"
      exit 1
    fi
    echo "🔧 Refactoring: $3"
    npm run ai:refactor "$2" "$3"
    ;;
  "docs")
    echo "📚 Updating documentation..."
    npm run ai:docs
    ;;
  "platform")
    if [ -z "$2" ]; then
      echo "Usage: ./ai-workflow.sh platform <mobile|desktop|extension>"
      exit 1
    fi
    echo "🏗️ Generating $2 platform..."
    npm run ai:platform "$2"
    ;;
  "help"|"")
    echo "🤖 AI Workflow Helper"
    echo ""
    echo "Commands:"
    echo "  setup              Initialize AI workflow"
    echo "  analyze [file]     Analyze code for refactoring opportunities"
    echo "  quality           Run comprehensive quality analysis"
    echo "  feature <name>    Generate new feature with full architecture"
    echo "  test <file>       Generate test templates for file"
    echo "  refactor <type> <file>  Apply specific refactoring"
    echo "  docs              Update AI documentation"
    echo "  platform <type>   Generate platform-specific code"
    echo "  help              Show this help"
    echo ""
    echo "Examples:"
    echo "  ./ai-workflow.sh feature user-profile"
    echo "  ./ai-workflow.sh analyze src/components/MyComponent.tsx"
    echo "  ./ai-workflow.sh test src/domain/entities/User.ts"
    echo "  ./ai-workflow.sh refactor extract-hook src/components/Form.tsx"
    ;;
  *)
    echo "Unknown command: $1"
    echo "Run './ai-workflow.sh help' for available commands"
    exit 1
    ;;
esac`;

    fs.writeFileSync('ai-workflow.sh', workflowScript);
    execSync('chmod +x ai-workflow.sh');

    console.log('   Workflow commands created');
  }

  async generateUsageGuide() {
    console.log('📖 Generating usage guide...');

    const usageGuide = `# AI Workflow Usage Guide

## Overview
This guide shows you how to leverage the AI workflow enhancements for seamless development in your Quran app project.

## Quick Start

### Daily Development Workflow
\`\`\`bash
# 1. Start with quality check
npm run ai:quality

# 2. Analyze code for improvements
npm run ai:analyze src/components/MyComponent.tsx

# 3. Generate tests for new code
npm run ai:tests src/domain/entities/NewEntity.ts

# 4. Create a new feature
npm run ai:feature prayer-times

# 5. Update documentation
npm run ai:docs
\`\`\`

### Using the Helper Script
\`\`\`bash
# Make the script executable (one time)
chmod +x ai-workflow.sh

# Use the helper for common tasks
./ai-workflow.sh quality
./ai-workflow.sh feature bookmarks-v2
./ai-workflow.sh analyze src/components/LargeComponent.tsx
\`\`\`

## AI Tools Reference

### 1. Quality Monitor
**Purpose**: Comprehensive code quality analysis
**Usage**: \`npm run ai:quality\`
**Output**: \`quality-report.json\`, \`ai-insights.json\`

**What it analyzes**:
- Test coverage
- Code complexity
- Duplication
- Maintainability
- Security issues
- Performance
- Accessibility

### 2. Feature Generator
**Purpose**: Generate complete features following clean architecture
**Usage**: \`npm run ai:feature <feature-name>\`

**What it creates**:
- Domain entities and services
- Application use cases
- Infrastructure repositories
- Presentation components (atomic design)
- Comprehensive tests
- Documentation

### 3. Test Generator
**Purpose**: Generate test templates based on code analysis
**Usage**: \`npm run ai:tests <file-path>\`

**Supported files**:
- Domain entities
- Services
- Components
- Hooks
- Repositories

### 4. Refactoring Assistant
**Purpose**: Analyze code and suggest/apply refactorings
**Usage**: \`npm run ai:analyze <file>\` or \`npm run ai:refactor <type> <file>\`

**Refactoring types**:
- extract-component
- extract-hook  
- extract-domain-service
- split-large-component
- convert-to-atomic
- add-error-boundary
- optimize-performance
- improve-accessibility

### 5. Platform Generator
**Purpose**: Generate platform-specific implementations
**Usage**: \`npm run ai:platform <mobile|desktop|extension>\`

**Platforms**:
- \`mobile\` - React Native mobile app
- \`desktop\` - Electron desktop app
- \`extension\` - Browser extension

### 6. Documentation Updater
**Purpose**: Keep documentation synchronized with code changes
**Usage**: \`npm run ai:docs\`

**What it updates**:
- Component registry
- Architecture diagrams
- API documentation
- Change logs

## AI Context System

### Context Files
Each directory contains a \`.ai\` file with specific guidance:

- \`app/.ai\` - Next.js App Router patterns
- \`src/.ai\` - Clean architecture guidelines
- \`lib/.ai\` - Utility development patterns
- \`types/.ai\` - TypeScript type organization
- \`tests/.ai\` - Testing strategies

### Using Context in AI Conversations
When working with AI assistants:

1. **Reference context files**: "Check the app/.ai file for component patterns"
2. **Use search patterns**: "Use the search patterns in docs/ai/search-patterns.md"
3. **Follow architecture**: "Follow the architecture map in docs/ai/architecture-map.md"

## Automated Workflows

### Git Hooks
Pre-commit and post-commit hooks automatically run AI checks:

- **Pre-commit**: Code analysis and quality checks
- **Post-commit**: Documentation updates

### GitHub Actions
The CI pipeline includes AI-enhanced workflows:
- Architecture validation
- Component analysis  
- Performance budgets
- Test generation suggestions

## Best Practices

### Before Starting Development
1. Run quality analysis: \`npm run ai:quality\`
2. Review AI insights for focus areas
3. Check architecture guidelines in docs/

### When Adding Features
1. Use feature generator: \`./ai-workflow.sh feature <name>\`
2. Follow generated structure
3. Run tests: \`npm run test\`
4. Update documentation: \`npm run ai:docs\`

### When Refactoring
1. Analyze first: \`npm run ai:analyze <file>\`
2. Apply suggested refactorings
3. Verify with quality check
4. Update tests if needed

### Multi-Platform Development
1. Follow shared domain patterns
2. Use platform generator for new platforms
3. Check multi-platform guide: \`docs/ai/multi-platform-guide.md\`

## Troubleshooting

### Common Issues

**Tool not found errors**:
- Ensure all files in \`tools/ai/\` are executable: \`chmod +x tools/ai/*.js\`
- Check Node.js version (requires 20+)

**Git hooks not running**:
- Check \`.git/hooks/\` permissions: \`chmod +x .git/hooks/*\`
- Ensure hooks are executable

**Quality analysis fails**:
- Install dependencies: \`npm ci\`
- Check test configuration: \`npm run test\`

### Getting Help
- Run \`./ai-workflow.sh help\` for command reference
- Check tool-specific help: \`node tools/ai/<tool-name>.js --help\`
- Review documentation in \`docs/ai/\`

## Integration with AI Assistants

### Effective Prompts
\`\`\`
# Good prompts for AI assistants:
"Analyze this component following the patterns in app/.ai"
"Generate tests for this domain entity using the testing guide"
"Refactor this code following clean architecture principles"
"Create a mobile version of this feature using the multi-platform guide"
\`\`\`

### Context Sharing
When working with AI, share:
1. Relevant \`.ai\` context files
2. Architecture documentation 
3. Current quality metrics
4. Project-specific patterns

This ensures AI assistance aligns with your project's architecture and standards.`;

    fs.writeFileSync('docs/AI_WORKFLOW_GUIDE.md', usageGuide);
    console.log('   Usage guide generated');
  }

  displayQuickStart() {
    console.log('🚀 AI Workflow Quick Start:');
    console.log('');
    console.log('1. Run quality analysis:');
    console.log('   npm run ai:quality');
    console.log('');
    console.log('2. Generate a new feature:');
    console.log('   ./ai-workflow.sh feature my-feature');
    console.log('');
    console.log('3. Analyze code for improvements:');
    console.log('   ./ai-workflow.sh analyze src/components/MyComponent.tsx');
    console.log('');
    console.log('4. Generate tests:');
    console.log('   ./ai-workflow.sh test src/domain/entities/MyEntity.ts');
    console.log('');
    console.log('5. Get help:');
    console.log('   ./ai-workflow.sh help');
    console.log('');
    console.log('📚 Documentation: docs/AI_WORKFLOW_GUIDE.md');
    console.log('🤖 Context files: Check .ai files in each directory');
    console.log('⚙️  Configuration: All tools configured in package.json scripts');
  }

  async help() {
    console.log('🤖 AI Workflow Integration Help');
    console.log('');
    console.log('Commands:');
    console.log('  initialize    Setup complete AI workflow integration');
    console.log('  validate     Check that all AI tools are properly configured');
    console.log('  help         Show this help message');
    console.log('');
    console.log('What this tool does:');
    console.log('• Sets up Git hooks for automated AI checks');
    console.log('• Configures package.json scripts for AI tools');
    console.log('• Creates workflow helper script (ai-workflow.sh)');
    console.log('• Generates comprehensive usage documentation');
    console.log('• Validates all AI tools and documentation');
    console.log('');
    console.log('After running initialize, you\'ll have:');
    console.log('• Pre-commit hooks for quality checks');
    console.log('• npm scripts for all AI tools');
    console.log('• Helper script for common workflows');
    console.log('• Complete documentation and guides');
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2] || 'initialize';
  const integration = new AIWorkflowIntegration();

  switch (command) {
    case 'initialize':
    case 'setup':
      integration.initialize().catch(console.error);
      break;
    case 'validate':
      integration.validateEnvironment()
        .then(() => console.log('✅ All AI tools validated successfully'))
        .catch(console.error);
      break;
    case 'help':
      integration.help();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      integration.help();
      break;
  }
}

module.exports = AIWorkflowIntegration;