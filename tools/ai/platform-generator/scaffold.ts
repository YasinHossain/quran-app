import fs from 'fs/promises';
import path from 'path';

import { PlatformConfig } from './config';

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeFileSafe(
  filePath: string,
  content: string,
  overwrite: boolean
): Promise<void> {
  try {
    if (!overwrite) {
      await fs.access(filePath);
      throw new Error(`File exists: ${filePath}`);
    }
  } catch {
    // ignore when file does not exist
  }
  await fs.writeFile(filePath, content, 'utf8');
}

export async function scaffoldProject(config: PlatformConfig): Promise<void> {
  const base = path.join(config.targetDir, config.platform);
  await ensureDir(base);
  await writeFileSafe(path.join(base, 'README.md'), `# ${config.projectName}\n`, config.overwrite);
}
