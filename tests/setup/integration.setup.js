require('./setupTests.ts');

// Integration test setup for repository and API tests
// Node.js environment - includes MSW for network mocking
//
// Usage: Import this file in integration tests that need MSW:
// setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js']
// or add this comment to test files: @jest-environment-options {"setupFilesAfterEnv": ["<rootDir>/tests/setup/integration.setup.js"]}

// Import MSW server
const { server } = require('./msw/server');

// MSW lifecycle hooks
beforeAll(() => {
  // Start the server before all tests
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // Reset handlers after each test to ensure test isolation
  server.resetHandlers();
});

afterAll(() => {
  // Close server after all tests are done
  server.close();
});

// Individual tests will set up logger spies as needed using moduleNameMapper
