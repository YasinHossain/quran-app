#!/usr/bin/env node
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);

// Allow override via env
const envRg = process.env.RG_PATH;

// Common fallback locations
const candidates = [];

if (envRg && existsSync(envRg)) candidates.push(envRg);

// 1) System ripgrep if available in PATH
candidates.push('rg');

// 2) Claude Code vendored path (best-effort; only on that dev box)
const claudeRg =
  '/Users/yasinhossain/.npm-global/lib/node_modules/@anthropic-ai/claude-code/vendor/ripgrep/arm64-darwin/rg';
if (existsSync(claudeRg)) candidates.push(claudeRg);

// 3) Local node_modules bin (if a ripgrep package is present in some envs)
const localBin = join(process.cwd(), 'node_modules', '.bin', 'rg');
if (existsSync(localBin)) candidates.push(localBin);

function tryRun(cmd) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: false });
    child.on('exit', (code) => resolve({ ok: true, code }));
    child.on('error', () => resolve({ ok: false }));
  });
}

const run = async () => {
  for (const cmd of candidates) {
    const res = await tryRun(cmd);
    if (res.ok) process.exit(res.code ?? 0);
  }
  console.error(
    'ripgrep not found. Install ripgrep (brew/apt/choco) or set RG_PATH to the binary.'
  );
  process.exit(1);
};

run();
