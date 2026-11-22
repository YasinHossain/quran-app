import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';

describe('localizeDigits', () => {
  it('converts western digits to Bangla digits', () => {
    expect(localizeDigits('2:255', 'bn')).toBe('২:২৫৫');
  });

  it('uses Extended Arabic-Indic digits for Persian, not Arabic-Indic', () => {
    expect(localizeDigits('2:255', 'fa')).toBe('\u06F2:\u06F2\u06F5\u06F5');
    expect(localizeDigits('2:255', 'ar')).toBe('\u0662:\u0662\u0665\u0665');
  });

  it('leaves text unchanged for unsupported languages', () => {
    expect(localizeDigits('2:255', 'en')).toBe('2:255');
  });
});

describe('formatNumber', () => {
  it('formats numbers with localized digits', () => {
    expect(formatNumber(123, 'bn', { useGrouping: false })).toBe('১২৩');
    expect(formatNumber(6236, 'fa', { useGrouping: false })).toBe('\u06F6\u06F2\u06F3\u06F6');
  });
});
