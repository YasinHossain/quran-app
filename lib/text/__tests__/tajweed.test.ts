import { applyTajweed } from '@/lib/text/tajweed';

describe('applyTajweed', () => {
  it('wraps meem with red span', () => {
    const result = applyTajweed('م');
    expect(result).toBe('<span class="text-red-600">م</span>');
  });

  it('wraps noon with green span', () => {
    const result = applyTajweed('ن');
    expect(result).toBe('<span class="text-green-600">ن</span>');
  });

  it('wraps multiple letters correctly', () => {
    const result = applyTajweed('من');
    expect(result).toBe('<span class="text-red-600">م</span><span class="text-green-600">ن</span>');
  });
});
