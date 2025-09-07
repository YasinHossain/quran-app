#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Platform Generator
 *
 * Delegates configuration loading/validation and project scaffolding
 * to dedicated modules. The core script stays lightweight and focused
 * on command-line orchestration.
 */

import path from 'path';

import { loadConfig, validateConfig, PlatformConfig } from './config';
import { scaffoldProject } from './scaffold';

async function resolveConfig(platformArg: string, configPath?: string): Promise<PlatformConfig> {
  if (configPath) {
    const file = path.resolve(configPath);
    const loaded = await loadConfig(file);
    return { ...loaded, platform: platformArg as PlatformConfig['platform'] };
  }

  return validateConfig({
    platform: platformArg,
    projectName: `${platformArg}-app`,
  });
}

async function main(): Promise<void> {
  const [, , platformArg, configPath] = process.argv;

  if (!platformArg) {
    console.log('Usage: node tools/ai/platform-generator/index.ts <platform> [config.json]');
    console.log('  platform: mobile | desktop | extension');
    process.exit(1);
  }

  try {
    const config = await resolveConfig(platformArg, configPath);
    await scaffoldProject(config);
    console.log(`\n✅ Generated ${config.platform} platform in ${config.targetDir}`);
  } catch (err) {
    console.error('❌ Generation failed');
    if (err instanceof Error) {
      console.error(err.message);
    }
    process.exit(1);
  }
}

main();
