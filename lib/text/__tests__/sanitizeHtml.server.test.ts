describe('sanitizeHtml on server', () => {
  it('sanitizes HTML without a DOM', async () => {
    const globalAny = globalThis as any;
    const originalWindow = globalAny.window;
    const originalDocument = globalAny.document;
    delete globalAny.window;
    delete globalAny.document;

    const { sanitizeHtml } = await import('../sanitizeHtml');
    const unsafe = '<img src="x" onerror="alert(1)" />';
    const sanitized = sanitizeHtml(unsafe);
    expect(sanitized).toBe('<img src="x">');

    globalAny.window = originalWindow;
    globalAny.document = originalDocument;
  });
});
