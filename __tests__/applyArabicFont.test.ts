import React from 'react';
import { render } from '@testing-library/react';
import { applyArabicFont } from '../lib/applyArabicFont';

describe('applyArabicFont', () => {
  it('wraps Arabic text in a span with the given font', () => {
    const html = applyArabicFont('السلام عليكم', 'Amiri');
    const { container } = render(
      React.createElement('div', { dangerouslySetInnerHTML: { __html: html } })
    );
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    spans.forEach((s) => expect(s).toHaveStyle('font-family: "Amiri";'));
    expect(container.textContent).toBe('السلام عليكم');
  });

  it('quotes font names with spaces', () => {
    const font = 'Noto Naskh Arabic';
    const html = applyArabicFont('السلام عليكم', font);
    const { container } = render(
      React.createElement('div', { dangerouslySetInnerHTML: { __html: html } })
    );
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    spans.forEach((s) => expect(s).toHaveStyle(`font-family: "${font}";`));
  });

  it('leaves non-Arabic text unchanged', () => {
    const text = 'Hello world';
    const html = applyArabicFont(text, 'Amiri');
    const { container } = render(
      React.createElement('div', { dangerouslySetInnerHTML: { __html: html } })
    );
    expect(container.querySelector('span')).toBeNull();
    expect(container.textContent).toBe(text);
  });

  it('does not wrap text multiple times when called repeatedly', () => {
    const input = 'السلام عليكم';
    const once = applyArabicFont(input, 'Amiri');
    const twice = applyArabicFont(once, 'Amiri');
    expect(twice).toBe(once);
  });
});
