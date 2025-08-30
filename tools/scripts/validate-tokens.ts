import { readdirSync, readFileSync } from 'fs';
import path from 'path';

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const designPath = path.resolve(__dirname, '..', 'design-system.json');
const design = JSON.parse(readFileSync(designPath, 'utf8'));
const allowedTokens = new Set(
  Object.keys(design.colors)
    .filter((key) => !key.endsWith('Dark'))
    .map(kebabCase)
);

const ignore: Record<string, Set<string>> = {
  text: new Set([
    'center',
    'left',
    'right',
    'justify',
    'start',
    'end',
    'xs',
    'sm',
    'base',
    'lg',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
    '6xl',
    '7xl',
    '8xl',
    '9xl',
  ]),
  bg: new Set([
    'cover',
    'contain',
    'center',
    'fixed',
    'local',
    'no-repeat',
    'repeat',
    'repeat-x',
    'repeat-y',
    'auto',
    'bottom',
    'top',
    'left',
    'right',
  ]),
  border: new Set([
    '0',
    '2',
    '4',
    '8',
    't',
    'b',
    'l',
    'r',
    'x',
    'y',
    'solid',
    'dashed',
    'double',
    'collapse',
    'separate',
  ]),
};

const tokenRegex = /(bg|text|border)-([a-zA-Z0-9-]+)/g;

function getFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.next', 'public'].includes(entry.name)) {
        continue;
      }
      files.push(...getFiles(fullPath));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const rootDir = path.resolve(__dirname, '..');
const files = getFiles(rootDir);
const undefinedTokens: Record<string, Set<string>> = {};

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(content))) {
    const prefix = match[1];
    const token = match[2];
    if (ignore[prefix]?.has(token)) continue;
    if (!allowedTokens.has(token)) {
      const key = `${prefix}-${token}`;
      undefinedTokens[key] ||= new Set();
      undefinedTokens[key].add(path.relative(rootDir, file));
    }
  }
}

if (Object.keys(undefinedTokens).length > 0) {
  console.error('Undefined design tokens found:');
  for (const [token, files] of Object.entries(undefinedTokens)) {
    console.error(`  ${token}`);
    for (const f of files) {
      console.error(`    - ${f}`);
    }
  }
  process.exit(1);
}

console.log('All token classes are defined in design-system.json');
