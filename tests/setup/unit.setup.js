// Unit test setup for domain, application, and infrastructure layer tests
// Node.js environment - no DOM APIs needed

// Ensure fetch is available in Node.js environment
if (typeof globalThis.fetch === 'undefined') {
  // Simple mock fetch for pure unit tests
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Individual tests will set up logger spies as needed using moduleNameMapper
