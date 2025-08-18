import { applyTajweed } from '@/lib/text/tajweed';

describe('applyTajweed', () => {
  it('wraps meem with error color span', () => {
    const result = applyTajweed('م');
    expect(result).toBe('<span class="text-error">م</span>');
  });

  it('wraps noon with accent color span', () => {
    const result = applyTajweed('ن');
    expect(result).toBe('<span class="text-accent">ن</span>');
  });

  it('wraps multiple letters correctly', () => {
    const result = applyTajweed('من');
    expect(result).toBe('<span class="text-error">م</span><span class="text-accent">ن</span>');
  });
});
