describe('sanitizeHtml on server', () => {
  it('sanitizes HTML without a DOM', async () => {
    const globalMutable = globalThis as typeof globalThis & {
      window?: unknown;
      document?: unknown;
    };
    const originalWindow = globalMutable.window;
    const originalDocument = globalMutable.document;
    delete globalMutable.window;
    delete globalMutable.document;

    const { sanitizeHtml } = await import('../sanitizeHtml');
    const unsafe = '<img src="x" onerror="alert(1)" />';
    const sanitized = sanitizeHtml(unsafe);
    expect(sanitized).toBe('<img src="x">');

    globalMutable.window = originalWindow;
    globalMutable.document = originalDocument;
  });
});
