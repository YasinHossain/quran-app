/* eslint-disable no-console */
export interface CLIOptions {
  featureName: string;
}

export function parseArgs(argv: string[]): CLIOptions {
  const featureName = argv[2];
  if (!featureName) {
    console.log('Usage: node tools/ai/feature-generator.mjs <feature-name>');
    console.log('Example: node tools/ai/feature-generator.mjs user-profile');
    process.exit(1);
  }
  return { featureName };
}
