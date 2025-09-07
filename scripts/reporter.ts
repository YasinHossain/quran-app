import type { RuleResult } from './rules';

export function report(result: RuleResult): void {
  // eslint-disable-next-line no-console -- CLI report heading
  console.log('\n📋 ARCHITECTURE COMPLIANCE REPORT\n');

  if (result.passed.length) {
    // eslint-disable-next-line no-console -- list of passed files
    console.log('✅ PASSED FILES:');
    for (const file of result.passed) {
      // eslint-disable-next-line no-console -- output passed file
      console.log(`  ${file}`);
    }
    // eslint-disable-next-line no-console -- spacing
    console.log('');
  }

  if (result.violations.length) {
    // eslint-disable-next-line no-console -- list of violations
    console.log('❌ VIOLATIONS:');
    for (const v of result.violations) {
      // eslint-disable-next-line no-console -- output violation
      console.log(`  ${v.file}: ${v.message}`);
    }
    // eslint-disable-next-line no-console -- spacing
    console.log('');
  }

  // eslint-disable-next-line no-console -- summary output
  console.log(`Summary: ${result.passed.length} passed, ${result.violations.length} violations`);
}
