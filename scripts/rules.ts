import fs from 'fs';

export interface Violation {
  file: string;
  message: string;
}

export interface RuleResult {
  passed: string[];
  violations: Violation[];
}

function checkFileLength(file: string, maxLines: number): Violation | null {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').length;
  if (lines > maxLines) {
    return { file, message: `exceeds ${maxLines} lines (${lines})` };
  }
  return null;
}

export function evaluate(files: string[], maxLines = 400): RuleResult {
  const result: RuleResult = { passed: [], violations: [] };

  for (const file of files) {
    const violation = checkFileLength(file, maxLines);
    if (violation) {
      result.violations.push(violation);
    } else {
      result.passed.push(file);
    }
  }

  return result;
}
