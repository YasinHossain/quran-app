import { sanitizeHtml } from '@/lib/text/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('removes script tags', () => {
    const unsafe = '<p>Test</p><script>alert(1)</script>';
    const sanitized = sanitizeHtml(unsafe);
    expect(sanitized).toBe('<p>Test</p>');
  });

  it('strips unsafe attributes', () => {
    const unsafe = '<img src="x" onerror="alert(1)" />';
    const sanitized = sanitizeHtml(unsafe);
    expect(sanitized).not.toMatch(/onerror/i);
  });
});
