#!/usr/bin/env node

/**
 * AI Test Generator
 *
 * Automatically generates test templates based on code changes
 * and existing patterns in the codebase.
 */

import fs from 'fs';
import path from 'path';

class AITestGenerator {
  constructor() {
    this.templates = {
      domainEntity: this.getDomainEntityTestTemplate(),
      domainService: this.getDomainServiceTestTemplate(),
      useCase: this.getUseCaseTestTemplate(),
      repository: this.getRepositoryTestTemplate(),
      component: this.getComponentTestTemplate(),
      hook: this.getHookTestTemplate(),
    };
  }

  async generateTests(filePath) {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const fileType = this.detectFileType(filePath);
    if (!fileType) {
      console.log(`No test template available for file: ${filePath}`);
      return;
    }

    const testPath = this.getTestPath(filePath);
    const testContent = await this.generateTestContent(filePath, fileType);

    if (fs.existsSync(testPath)) {
      console.log(`Test file already exists: ${testPath}`);
      console.log('Use --force to overwrite');
      return;
    }

    fs.writeFileSync(testPath, testContent);
    console.log(`✅ Generated test file: ${testPath}`);
  }

  detectFileType(filePath) {
    if (filePath.includes('src/domain/entities/')) return 'domainEntity';
    if (filePath.includes('src/domain/services/')) return 'domainService';
    if (filePath.includes('src/application/use-cases/')) return 'useCase';
    if (filePath.includes('src/infrastructure/repositories/')) return 'repository';
    if (filePath.includes('/components/') && filePath.endsWith('.tsx')) return 'component';
    if (filePath.includes('/hooks/') && filePath.startsWith('use')) return 'hook';
    return null;
  }

  getTestPath(filePath) {
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);

    // For domain/application/infrastructure - use tests/ directory
    if (filePath.includes('src/')) {
      const relativePath = path.relative('src', filePath);
      const testDir = path.join('tests', path.dirname(relativePath));
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      return path.join(testDir, `${baseName}.test.ts`);
    }

    // For components/hooks - use local __tests__ directory
    const testDir = path.join(dirName, '__tests__');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    return path.join(testDir, `${baseName}.test.tsx`);
  }

  async generateTestContent(filePath, fileType) {
    const content = fs.readFileSync(filePath, 'utf8');
    const className = this.extractClassName(content);
    const imports = this.extractImports(content);
    const methods = this.extractMethods(content);

    const template = this.templates[fileType];

    return template
      .replace(/\{\{className\}\}/g, className)
      .replace(/\{\{filePath\}\}/g, this.getImportPath(filePath))
      .replace(/\{\{imports\}\}/g, this.generateImports(imports, fileType))
      .replace(/\{\{tests\}\}/g, this.generateTests(methods, fileType))
      .replace(/\{\{setup\}\}/g, this.generateSetup(fileType, className))
      .replace(/\{\{mocks\}\}/g, this.generateMocks(fileType));
  }

  extractClassName(content) {
    const classMatch = content.match(/export\s+class\s+(\w+)/);
    const functionMatch = content.match(/export\s+const\s+(\w+).*=.*React\.FC/);
    const hookMatch = content.match(/export\s+const\s+(use\w+)/);

    return classMatch?.[1] || functionMatch?.[1] || hookMatch?.[1] || 'UnknownClass';
  }

  extractImports(content) {
    const imports = [];
    const importMatches = content.matchAll(/import.*from\s+['"](.+)['"]/g);

    for (const match of importMatches) {
      if (!match[1].startsWith('.')) {
        imports.push(match[1]);
      }
    }

    return imports;
  }

  extractMethods(content) {
    const methods = [];

    // Public methods in classes
    const methodMatches = content.matchAll(/public\s+(\w+)\s*\(/g);
    for (const match of methodMatches) {
      methods.push(match[1]);
    }

    // Regular methods in classes
    const regularMethodMatches = content.matchAll(/^\s+(\w+)\s*\([^)]*\)\s*[:{}]/gm);
    for (const match of regularMethodMatches) {
      if (!['constructor', 'render', 'componentDidMount'].includes(match[1])) {
        methods.push(match[1]);
      }
    }

    return [...new Set(methods)];
  }

  getImportPath(filePath) {
    // Convert absolute path to relative import path
    if (filePath.includes('src/')) {
      return '@/' + path.relative('src', filePath).replace(/\.(ts|tsx)$/, '');
    }
    return './' + path.basename(filePath, path.extname(filePath));
  }

  generateImports(imports, fileType) {
    const testImports = [
      "import { jest } from '@jest/globals';",
      "import { render, screen } from '@testing-library/react';",
      "import { userEvent } from '@testing-library/user-event';",
    ];

    if (fileType === 'component') {
      testImports.push("import { TestProviders } from '../../test-utils/TestProviders';");
    }

    if (fileType === 'repository') {
      testImports.push("import { MockHttpClient } from '../../mocks/MockHttpClient';");
      testImports.push("import { MockCache } from '../../mocks/MockCache';");
    }

    return testImports.join('\n');
  }

  generateTests(methods, fileType) {
    if (methods.length === 0) {
      return this.getDefaultTest(fileType);
    }

    return methods
      .map((method) => {
        return `  describe('${method}', () => {
    it('should ${method.toLowerCase()} successfully', async () => {
      // Arrange

      // Act

      // Assert
      expect(true).toBe(true);
    });

    it('should handle errors in ${method}', async () => {
      // Arrange

      // Act & Assert
      await expect(async () => {
        // action
      }).rejects.toThrow();
    });
  });\n`;
      })
      .join('\n');
  }

  generateSetup(fileType, className) {
    switch (fileType) {
      case 'domainEntity':
      case 'domainService':
        return `  let instance: ${className};

  beforeEach(() => {
    instance = new ${className}();
  });`;

      case 'repository':
        return `  let repository: ${className};
  let mockApiClient: jest.Mocked<Record<string, unknown>>;
  let mockCache: jest.Mocked<Record<string, unknown>>;

  beforeEach(() => {
    mockApiClient = MockHttpClient.create();
    mockCache = MockCache.create();
    repository = new ${className}(mockApiClient, mockCache);
  });`;

      case 'component':
        return `  const defaultProps = {
    /* required props */
  };

  const renderComponent = (props = {}) => {
    return render(
      <TestProviders>
        <${className} {...defaultProps} {...props} />
      </TestProviders>
    );
  };`;

      case 'hook':
        return `  const renderHook = (props = {}) => {
    return renderHook(() => ${className}(props), {
      wrapper: TestProviders,
    });
  };`;

      default:
        return '';
    }
  }

  generateMocks(fileType) {
    switch (fileType) {
      case 'repository':
        return `  // Mock API responses
  const mockApiResponse = {
    data: {},
  };

  const mockDomainEntity = {
    id: 'id',
  };`;

      case 'component':
        return `  // Mock functions
  const mockOnClick = jest.fn();
  const mockOnChange = jest.fn();`;

      default:
        return '';
    }
  }

  getDefaultTest(fileType) {
    switch (fileType) {
      case 'component':
        return `  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });`;

      case 'hook':
        return `  it('should initialize with default values', () => {
    const { result } = renderHook();
    expect(result.current).toBeDefined();
  });`;

      default:
        return `  it('should be defined', () => {
    expect(instance).toBeDefined();
  });`;
    }
  }

  // Template definitions
  getDomainEntityTestTemplate() {
    return `/**
 * Tests for {{className}} domain entity
 * 
 * This file tests business logic and domain rules.
 * Focus on behavior, not implementation details.
 */

{{imports}}
import { {{className}} } from '{{filePath}}';

describe('{{className}}', () => {
{{setup}}

{{tests}}
});`;
  }

  getDomainServiceTestTemplate() {
    return `/**
 * Tests for {{className}} domain service
 * 
 * Tests coordination between entities and complex business logic.
 */

{{imports}}
import { {{className}} } from '{{filePath}}';
{{mocks}}

describe('{{className}}', () => {
{{setup}}

{{tests}}
});`;
  }

  getUseCaseTestTemplate() {
    return `/**
 * Tests for {{className}} use case
 * 
 * Tests application-specific business workflows.
 */

{{imports}}
import { {{className}} } from '{{filePath}}';
{{mocks}}

describe('{{className}}', () => {
{{setup}}

{{tests}}
});`;
  }

  getRepositoryTestTemplate() {
    return `/**
 * Integration tests for {{className}}
 * 
 * Tests repository implementation with mocked dependencies.
 */

{{imports}}
import { {{className}} } from '{{filePath}}';
{{mocks}}

describe('{{className}} Integration', () => {
{{setup}}

{{tests}}
});`;
  }

  getComponentTestTemplate() {
    return `/**
 * Tests for {{className}} component
 * 
 * Tests user interactions and component behavior.
 */

{{imports}}
import { {{className}} } from '../{{className}}';
{{mocks}}

describe('{{className}}', () => {
{{setup}}

{{tests}}
});`;
  }

  getHookTestTemplate() {
    return `/**
 * Tests for {{className}} hook
 * 
 * Tests hook behavior and state management.
 */

{{imports}}
import { {{className}} } from '../{{className}}';
{{mocks}}

describe('{{className}}', () => {
{{setup}}

{{tests}}
});`;
  }
}

// CLI interface
if (require.main === module) {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log('Usage: node test-generator.js <file-path>');
    console.log('Example: node test-generator.js src/domain/entities/Verse.ts');
    process.exit(1);
  }

  const generator = new AITestGenerator();
  generator.generateTests(filePath).catch(console.error);
}

module.exports = AITestGenerator;
