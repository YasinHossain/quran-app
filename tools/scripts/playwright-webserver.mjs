import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = new URL('../..', import.meta.url);
const cwd = fileURLToPath(repoRoot);

const port = process.env.PLAYWRIGHT_PORT ?? process.env.PORT ?? '3000';
const host = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

async function main() {
  await run('npm', ['run', 'build']);

  const nextStart = spawn(
    'node',
    ['node_modules/next/dist/bin/next', 'start', '-H', host, '-p', port],
    { cwd, stdio: 'inherit' }
  );

  const shutdown = (signal) => {
    if (nextStart.killed) return;
    nextStart.kill(signal);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('exit', () => shutdown('SIGTERM'));

  await new Promise((resolve, reject) => {
    nextStart.on('error', reject);
    nextStart.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`next start exited with code ${code}`));
    });
  });
}

await main();
