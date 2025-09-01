#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

// Use Claude Code's ripgrep binary
const rgPath =
  '/Users/yasinhossain/.npm-global/lib/node_modules/@anthropic-ai/claude-code/vendor/ripgrep/arm64-darwin/rg';

const child = spawn(rgPath, args, { stdio: 'inherit', shell: false });

child.on('exit', (code) => process.exit(code));
child.on('error', (err) => {
  console.error('Failed to run ripgrep binary:', err.message);
  process.exit(1);
});
