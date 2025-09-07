import { execSync } from 'child_process';

export function run(command: string): void {
  execSync(command, { stdio: 'inherit' });
}
