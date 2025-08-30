#!/usr/bin/env node

/**
 * Token Migration Utility
 * Converts hardcoded Tailwind classes to design tokens
 */

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

const MIGRATION_MAP = {
  // Background colors
  'bg-white': 'bg-surface',
  'bg-slate-50': 'bg-surface',
  'bg-slate-100': 'bg-interactive',
  'bg-slate-800': 'bg-surface',
  'bg-slate-900': 'bg-background',
  'bg-gray-100': 'bg-interactive',
  'bg-gray-800': 'bg-surface',

  // Text colors
  'text-slate-900': 'text-foreground',
  'text-slate-800': 'text-foreground',
  'text-slate-700': 'text-foreground',
  'text-slate-600': 'text-muted',
  'text-slate-500': 'text-muted',
  'text-slate-400': 'text-muted',
  'text-slate-300': 'text-muted',
  'text-white': 'text-foreground',
  'text-gray-500': 'text-muted',
  'text-gray-400': 'text-muted',

  // Border colors
  'border-slate-200': 'border-border',
  'border-slate-700': 'border-border',
  'border-gray-200': 'border-border',

  // Shadows
  'shadow-lg': 'shadow-card',
  'hover:shadow-xl': 'hover:shadow-card-hover',

  // Border radius
  'rounded-lg': 'rounded-md',
  'rounded-xl': 'rounded-lg',
  'rounded-2xl': 'rounded-xl',

  // Common accent colors
  'text-emerald-600': 'text-accent',
  'text-emerald-400': 'text-accent',
  'bg-emerald-100': 'bg-accent/10',
  'bg-emerald-500/20': 'bg-accent/20',
  'hover:text-emerald-600': 'hover:text-accent',
  'hover:text-emerald-400': 'hover:text-accent',
  'group-hover:text-emerald-600': 'group-hover:text-accent',
  'group-hover:text-emerald-400': 'group-hover:text-accent',
};

const THEME_CONDITIONAL_PATTERNS = [
  {
    pattern: /\${theme === 'light' \? '([^']+)' : '([^']+)'}/g,
    replacement: (match, lightClass, darkClass) => {
      const tokenized = MIGRATION_MAP[lightClass] || lightClass;
      return `${tokenized} dark:${darkClass}`;
    },
  },
  {
    pattern: /theme === 'light'\s*\?\s*'([^']+)'\s*:\s*'([^']+)'/g,
    replacement: (match, lightClass, darkClass) => {
      const tokenized = MIGRATION_MAP[lightClass] || lightClass;
      return `${tokenized} dark:${darkClass}`;
    },
  },
];

async function migrateFile(filePath) {
  console.log(`Migrating: ${filePath}`);

  let content = await readFile(filePath, 'utf8');
  let hasChanges = false;

  // Replace direct class mappings
  for (const [oldClass, newClass] of Object.entries(MIGRATION_MAP)) {
    const regex = new RegExp(`\\b${oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      hasChanges = true;
      console.log(`  ✓ ${oldClass} → ${newClass}`);
    }
  }

  // Replace theme conditionals
  for (const { pattern, replacement } of THEME_CONDITIONAL_PATTERNS) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      hasChanges = true;
      console.log(`  ✓ Converted theme conditional`);
    }
  }

  if (hasChanges) {
    await writeFile(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes needed for ${filePath}`);
  }

  return hasChanges;
}

async function main() {
  console.log('🚀 Starting token migration...\n');

  // Find all TypeScript and TSX files
  const files = await glob('app/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/__tests__/**', '**/*.test.*'],
  });

  let totalFiles = 0;
  let modifiedFiles = 0;

  for (const file of files) {
    totalFiles++;
    const hasChanges = await migrateFile(file);
    if (hasChanges) modifiedFiles++;
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - modifiedFiles}`);

  if (modifiedFiles > 0) {
    console.log(`\n⚠️  Remember to:`);
    console.log(`   - Test the application`);
    console.log(`   - Run 'npm run lint' to check for issues`);
    console.log(`   - Commit changes with descriptive message`);
  }
}

main().catch(console.error);
