#!/usr/bin/env node

import { parseArgs } from './feature-generator/cli.ts';
import { generateFeature } from './feature-generator/writer/index.ts';

const { featureName } = parseArgs(process.argv);

generateFeature(featureName).catch((error) => {
  console.error('❌ Feature generation failed:', error.message);
  process.exit(1);
});

export { generateFeature };
