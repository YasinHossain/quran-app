#!/usr/bin/env ts-node

import sync from './ai-development-helper/sync';
import regen from './ai-development-helper/regen';

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
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
