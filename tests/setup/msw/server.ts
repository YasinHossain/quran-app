// Mock Service Worker server setup for Node.js test environment
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

// Setup MSW server with our handlers
export const server = setupServer(...handlers);

// Export individual functions for test control
export const startServer = () => server.listen();
export const stopServer = () => server.close();
export const resetHandlers = () => server.resetHandlers();

// Helper to add additional handlers in tests
export const addHandlers = (...newHandlers: Parameters<typeof server.use>) => {
  server.use(...newHandlers);
};

export { handlers };
