#!/usr/bin/env node

/**
 * Component Generator
 * Creates standardized components from template
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

function toPascalCase(str) {
  return str.replace(/(?:^|[-_])(.)/g, (_, char) => char.toUpperCase());
}

// Utility function preserved for potential future use
// function toCamelCase(str) {
//   const pascal = toPascalCase(str);
//   return pascal.charAt(0).toLowerCase() + pascal.slice(1);
// }

async function generateComponent(componentName, options = {}) {
  const {
    directory = 'app/shared/ui',
    description = 'A reusable UI component',
    designTokens = ['surface', 'foreground'],
    includeStory = true,
    includeTest = true,
  } = options;

  const pascalName = toPascalCase(componentName);
  const componentDir = path.join(directory, pascalName);
  const componentFile = path.join(componentDir, `${pascalName}.tsx`);
  const indexFile = path.join(componentDir, 'index.ts');
  const storyFile = path.join(componentDir, `${pascalName}.stories.tsx`);
  const testFile = path.join(componentDir, `${pascalName}.test.tsx`);

  // Read template
  const template = await readFile('templates/Component.template.tsx', 'utf8');

  // Replace placeholders
  const componentContent = template
    .replace(/\[COMPONENT_NAME\]/g, pascalName)
    .replace(/\[DESCRIPTION OF COMPONENT PURPOSE\]/g, description)
    .replace(/\[LIST_TOKENS_USED\]/g, designTokens.join(', '));

  // Create directory
  if (!existsSync(componentDir)) {
    await mkdir(componentDir, { recursive: true });
  }

  // Write component file
  await writeFile(componentFile, componentContent);
  console.log(`✅ Created component: ${componentFile}`);

  // Create index file
  const indexContent = `export { ${pascalName} } from './${pascalName}';
export type { ${pascalName}Props } from './${pascalName}';
`;
  await writeFile(indexFile, indexContent);
  console.log(`✅ Created index: ${indexFile}`);

  // Create Storybook story
  if (includeStory) {
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${pascalName} } from './${pascalName}';

export const meta: Meta<typeof ${pascalName}> = {
  title: 'UI/${pascalName}',
  component: ${pascalName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: '${pascalName} Content',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: '${pascalName} Content',
    variant: 'secondary',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: '${pascalName} Content',
    variant: 'ghost',
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    children: '${pascalName} Content',
    variant: 'primary',
    size: 'md',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '${pascalName} Content',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};
`;
    await writeFile(storyFile, storyContent);
    console.log(`✅ Created story: ${storyFile}`);
  }

  // Create test file
  if (includeTest) {
    const testContent = `import { render, screen } from '@testing-library/react';
import { ${pascalName} } from './${pascalName}';

describe('${pascalName}', () => {
  it('renders children correctly', () => {
    render(<${pascalName}>Test content</${pascalName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<${pascalName} variant="secondary">Test</${pascalName}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('bg-surface');
  });

  it('applies size classes correctly', () => {
    render(<${pascalName} size="lg">Test</${pascalName}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-lg');
  });

  it('shows loading state', () => {
    render(<${pascalName} isLoading>Test</${pascalName}>);
    const element = screen.getByText('Test');
    expect(element).toHaveAttribute('aria-busy', 'true');
  });

  it('shows disabled state', () => {
    render(<${pascalName} disabled>Test</${pascalName}>);
    const element = screen.getByText('Test');
    expect(element).toHaveAttribute('aria-disabled', 'true');
    expect(element).toHaveClass('opacity-50', 'pointer-events-none');
  });

  it('accepts custom className', () => {
    render(<${pascalName} className="custom-class">Test</${pascalName}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
  });
});
`;
    await writeFile(testFile, testContent);
    console.log(`✅ Created test: ${testFile}`);
  }

  console.log(`\n🎉 Successfully generated ${pascalName} component!`);
  console.log(`\n📁 Files created:`);
  console.log(`   ${componentFile}`);
  console.log(`   ${indexFile}`);
  if (includeStory) console.log(`   ${storyFile}`);
  if (includeTest) console.log(`   ${testFile}`);

  console.log(`\n📚 Next steps:`);
  console.log(`   1. Customize the component implementation`);
  console.log(`   2. Update variants and sizes as needed`);
  console.log(`   3. Add to main UI exports if needed`);
  console.log(`   4. Run tests: npm test ${pascalName}`);
  if (includeStory) console.log(`   5. View in Storybook: npm run storybook`);
}

// CLI usage
const [, , componentName, ...args] = process.argv;

if (!componentName) {
  console.error('Usage: node scripts/generate-component.mjs <component-name> [options]');
  console.error('');
  console.error('Examples:');
  console.error('  node scripts/generate-component.mjs Modal');
  console.error('  node scripts/generate-component.mjs DataTable');
  console.error('  node scripts/generate-component.mjs IconButton');
  process.exit(1);
}

// Parse basic options (can be enhanced)
const options = {};
if (args.includes('--no-story')) options.includeStory = false;
if (args.includes('--no-test')) options.includeTest = false;

generateComponent(componentName, options).catch(console.error);
