import fs from 'fs/promises';
import { z } from 'zod';

export const PlatformConfigSchema = z.object({
  platform: z.enum(['mobile', 'desktop', 'extension']),
  projectName: z.string().min(1),
  targetDir: z.string().default('src/platforms'),
  overwrite: z.boolean().default(false),
});

export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

export function validateConfig(config: unknown): PlatformConfig {
  return PlatformConfigSchema.parse(config);
}

export async function loadConfig(path: string): Promise<PlatformConfig> {
  const raw = await fs.readFile(path, 'utf8');
  return validateConfig(JSON.parse(raw));
}
