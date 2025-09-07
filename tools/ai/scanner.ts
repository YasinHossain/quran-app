import { execSync } from 'child_process';

export const docMappings: Record<string, string> = {
  'src/domain/entities/': 'docs/ai/component-registry.md',
  'src/domain/services/': 'docs/ai/architecture-map.md',
  'src/presentation/components/': 'docs/ai/component-registry.md',
  'app/(features)/': 'docs/ai/component-registry.md',
  'types/': 'docs/ai/architecture-map.md',
};

export function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  }
}

export function identifyDocsToUpdate(changedFiles: string[]): string[] {
  const docsToUpdate = new Set<string>();

  for (const file of changedFiles) {
    for (const [pathPattern, docFile] of Object.entries(docMappings)) {
      if (file.includes(pathPattern)) {
        docsToUpdate.add(docFile);
      }
    }
  }

  return Array.from(docsToUpdate);
}
