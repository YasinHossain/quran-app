#!/usr/bin/env ts-node

import regen from './ai-development-helper/regen';
import sync from './ai-development-helper/sync';

async function main(): Promise<void> {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'sync':
        await sync();
        break;
      case 'regen':
        await regen();
        break;
      default:
        // eslint-disable-next-line no-console -- CLI usage error output
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    // eslint-disable-next-line no-console -- CLI error output
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
