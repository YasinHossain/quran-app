// Mock Service Worker server setup for Node.js test environment
const { setupServer } = require('msw/node');

const { handlers } = require('./handlers');

// Setup MSW server with our handlers
const server = setupServer(...handlers);

// Export individual functions for test control
const startServer = () => server.listen();
const stopServer = () => server.close();
const resetHandlers = () => server.resetHandlers();

// Helper to add additional handlers in tests
const addHandlers = (...newHandlers) => {
  server.use(...newHandlers);
};

module.exports = {
  server,
  startServer,
  stopServer,
  resetHandlers,
  addHandlers,
  handlers,
};
