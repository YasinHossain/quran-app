import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

describe('applyArabicFont', () => {
  it('wraps Arabic text with span using provided font', () => {
    const html = 'Hello سلام world';
    const result = applyArabicFont(html, 'Amiri');
    expect(result).toBe('Hello <span style="font-family:&quot;Amiri&quot;;">سلام</span> world');
  });

  it('leaves strings without Arabic characters unchanged', () => {
    const html = 'Hello world';
    expect(applyArabicFont(html, 'Amiri')).toBe(html);
  });

  it('replaces existing spans to avoid nesting', () => {
    const initial = applyArabicFont('سلام', 'Font1');
    const result = applyArabicFont(initial, 'Font2');
    expect(result).toBe('<span style="font-family:&quot;Font2&quot;;">سلام</span>');
  });
});
