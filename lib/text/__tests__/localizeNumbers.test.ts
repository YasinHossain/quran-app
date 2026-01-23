import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';

describe('localizeDigits', () => {
  it('converts western digits to Bangla digits', () => {
    expect(localizeDigits('2:255', 'bn')).toBe('২:২৫৫');
  });

  it('leaves text unchanged for unsupported languages', () => {
    expect(localizeDigits('2:255', 'en')).toBe('2:255');
  });
});

describe('formatNumber', () => {
  it('formats numbers with localized digits', () => {
    expect(formatNumber(123, 'bn', { useGrouping: false })).toBe('১২৩');
  });
});
