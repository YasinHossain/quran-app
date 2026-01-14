import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

describe('applyArabicFont', () => {
  it('wraps Arabic text with span using provided font', () => {
    const html = 'Hello سلام world';
    const result = applyArabicFont(html, 'Scheherazade New');
    expect(result).toBe(
      'Hello <span style="font-family:&quot;Scheherazade New&quot;;">سلام</span> world'
    );
  });

  it('leaves strings without Arabic characters unchanged', () => {
    const html = 'Hello world';
    expect(applyArabicFont(html, 'Scheherazade New')).toBe(html);
  });

  it('replaces existing spans to avoid nesting', () => {
    const initial = applyArabicFont('سلام', 'Font1');
    const result = applyArabicFont(initial, 'Font2');
    expect(result).toBe('<span style="font-family:&quot;Font2&quot;;">سلام</span>');
  });
});
