#!/usr/bin/env node

/**
 * Architecture Compliance Check CLI wrapper
 * Invokes scanner and rules modules and reports results.
 */
import { createRequire } from 'module';
import { register } from 'ts-node';

register();
const require = createRequire(import.meta.url);

const { scan } = require('./scanner.ts');
const { evaluate } = require('./rules.ts');
const { report } = require('./reporter.ts');

async function main() {
  const files = scan(process.cwd());
  const result = evaluate(files);
  report(result);
  process.exit(result.violations.length ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
