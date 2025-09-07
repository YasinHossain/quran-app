/**
 * Scaffolds a new feature page along with a basic test file.
 *
 * Expects a kebab-case feature name as the first CLI argument and generates:
 * - `app/(features)/<name>/page.tsx`
 * - `app/(features)/<name>/components/.gitkeep`
 * - `app/(features)/<name>/__tests__/<Pascal>Page.test.tsx`
 */
/* eslint-disable no-console */
import { mkdir, writeFile } from 'fs/promises';

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

async function main(): Promise<void> {
  const name = process.argv[2];
  if (!name) {
    console.error('Usage: ts-node scripts/generateFeature.ts <name>');
    process.exit(1);
  }

  const pascal = toPascalCase(name);
  const dir = `app/(features)/${name}`;
  await mkdir(dir, { recursive: true });
  await Promise.all([
    mkdir(`${dir}/context`, { recursive: true }),
    mkdir(`${dir}/hooks`, { recursive: true }),
    mkdir(`${dir}/lib`, { recursive: true }),
    mkdir(`${dir}/components`, { recursive: true }),
    mkdir(`${dir}/__tests__`, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(`${dir}/context/.gitkeep`, ''),
    writeFile(`${dir}/hooks/.gitkeep`, ''),
    writeFile(`${dir}/lib/.gitkeep`, ''),
    writeFile(`${dir}/components/.gitkeep`, ''),
  ]);

  const page = `// ${dir}/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { getRandomVerse } from '@/lib/api';
import { Verse } from '@/types';

export const ${pascal}Page = () => {
  const { settings } = useSettings();
  const [verse, setVerse] = useState<Verse | null>(null);

  useEffect(() => {
    getRandomVerse(settings.translationId).then(setVerse);
  }, [settings.translationId]);

  if (!verse) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">${pascal}</h1>
      <p>{verse.text_uthmani}</p>
    </div>
  );
};
`;

  await writeFile(`${dir}/page.tsx`, page);

  const test = `import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import * as api from '@/lib/api';
import { Verse } from '@/types';
import { ${pascal}Page } from '@/app/(features)/${name}/page';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock('@/lib/api');

const mockVerse: Verse = { id: 1, verse_key: '1:1', text_uthmani: '${name} verse', words: [] } as Verse;

beforeEach(() => {
  (api.getRandomVerse as jest.Mock).mockResolvedValue(mockVerse);
});

test('renders API data', async () => {
  render(
    <SettingsProvider>
      <${pascal}Page />
    </SettingsProvider>
  );
  expect(await screen.findByText('${name} verse')).toBeInTheDocument();
});
`;

  await writeFile(`${dir}/__tests__/${pascal}Page.test.tsx`, test);
  console.log(`Generated feature '${name}' at ${dir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
