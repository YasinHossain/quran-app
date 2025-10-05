import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function hexToRgb(hex: string): string {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const designSystemPath = path.resolve('design-system.json');
const themePath = path.resolve('app/theme.css');

const design = JSON.parse(readFileSync(designSystemPath, 'utf8'));
const colors = design.colors as Record<string, string>;

const baseKeys = Object.keys(colors).filter((key) => !key.endsWith('Dark'));

const rootVars = baseKeys
  .map((key) => `  --color-${kebabCase(key)}: ${hexToRgb(colors[key]!)};`)
  .join('\n');

const darkVars = baseKeys
  .map((key) => {
    const darkKey = `${key}Dark`;
    const color = colors[darkKey] ?? colors[key]!;
    return `  --color-${kebabCase(key)}: ${hexToRgb(color)};`;
  })
  .join('\n');

const css = `:root {\n${rootVars}\n}\n\n.dark {\n${darkVars}\n}\n`;

writeFileSync(themePath, css);
console.warn('Generated theme tokens.');
