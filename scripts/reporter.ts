import type { RuleResult } from './rules';

export function report(result: RuleResult): void {
  console.log('\n📋 ARCHITECTURE COMPLIANCE REPORT\n');

  if (result.passed.length) {
    console.log('✅ PASSED FILES:');
    for (const file of result.passed) {
      console.log(`  ${file}`);
    }

    console.log('');
  }

  if (result.violations.length) {
    console.log('❌ VIOLATIONS:');
    for (const v of result.violations) {
      console.log(`  ${v.file}: ${v.message}`);
    }

    console.log('');
  }

  console.log(`Summary: ${result.passed.length} passed, ${result.violations.length} violations`);
}
