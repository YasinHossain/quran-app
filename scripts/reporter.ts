import type { RuleResult } from './rules';

export function report(result: RuleResult): void {
  console.warn('\n📋 ARCHITECTURE COMPLIANCE REPORT\n');

  if (result.passed.length) {
    console.warn('✅ PASSED FILES:');
    for (const file of result.passed) {
      console.warn(`  ${file}`);
    }

    console.warn('');
  }

  if (result.violations.length) {
    console.error('❌ VIOLATIONS:');
    for (const v of result.violations) {
      console.error(`  ${v.file}: ${v.message}`);
    }

    console.warn('');
  }

  console.warn(`Summary: ${result.passed.length} passed, ${result.violations.length} violations`);
}
