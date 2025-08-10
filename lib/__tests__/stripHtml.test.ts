import { stripHtml } from '../text/stripHtml';

describe('stripHtml', () => {
  it('should remove simple HTML tags', () => {
    const input = '<p>Hello, <b>World</b>!</p>';
    const expected = 'Hello, World!';
    expect(stripHtml(input)).toBe(expected);
  });

  it('should return an empty string for null or undefined input', () => {
    expect(stripHtml(null as any)).toBe('');
    expect(stripHtml(undefined as any)).toBe('');
  });

  it('should handle strings with no HTML', () => {
    const input = 'This is a plain string.';
    expect(stripHtml(input)).toBe(input);
  });

  it('should handle complex HTML', () => {
    const input = '<div><span>Some text</span><a href="#"> and a link</a></div>';
    const expected = 'Some text and a link';
    expect(stripHtml(input)).toBe(expected);
  });

  it('should remove script and style blocks', () => {
    const input = '<p>Keep this.</p><script>alert("Remove this!");</script><style>.remove { color: red; }</style>';
    const expected = 'Keep this.';
    expect(stripHtml(input)).toBe(expected);
  });
});