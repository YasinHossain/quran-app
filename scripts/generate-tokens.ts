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
const tailwindConfigPath = path.resolve('tailwind.config.mjs');
const themePath = path.resolve('app/theme.css');

const design = JSON.parse(readFileSync(designSystemPath, 'utf8'));
const colors = design.colors as Record<string, string>;

const baseKeys = Object.keys(colors).filter((key) => !key.endsWith('Dark'));

const rootVars = baseKeys
  .map((key) => `  --color-${kebabCase(key)}: ${hexToRgb(colors[key])};`)
  .join('\n');

const darkVars = baseKeys
  .map((key) => {
    const darkKey = `${key}Dark`;
    return `  --color-${kebabCase(key)}: ${hexToRgb(colors[darkKey] || colors[key])};`;
  })
  .join('\n');

const css = `:root {\n${rootVars}\n}\n\n.dark {\n${darkVars}\n}\n`;

writeFileSync(themePath, css);

const colorEntries = baseKeys
  .map((key) => {
    const name = kebabCase(key);
    const prop = name.includes('-') ? `'${name}'` : name;
    return `        ${prop}: 'rgb(var(--color-${name}) / <alpha-value>)',`;
  })
  .join('\n');

const tailwindConfig = readFileSync(tailwindConfigPath, 'utf8');
const updatedConfig = tailwindConfig.replace(
  /colors: {[\s\S]*?},\n      spacing:/,
  `colors: {\n${colorEntries}\n      },\n      spacing:`
);

writeFileSync(tailwindConfigPath, updatedConfig);
console.log('Generated theme tokens.');
