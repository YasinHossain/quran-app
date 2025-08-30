#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const binName = isWin ? 'rg.exe' : 'rg';
const rgPath = path.join(__dirname, '..', 'node_modules', 'vscode-ripgrep', 'bin', binName);

const args = process.argv.slice(2);

const child = spawn(rgPath, args, { stdio: 'inherit', shell: false });

child.on('exit', (code) => process.exit(code));
child.on('error', (err) => {
  console.error('Failed to run ripgrep binary:', err.message);
  process.exit(1);
});
