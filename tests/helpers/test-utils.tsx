import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: 'light' | 'dark' | 'system';
}

// This creates a custom render function that includes all necessary providers
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider initialTheme="light">
      <SettingsProvider>
        <SidebarProvider>
          <BookmarkProvider>{children}</BookmarkProvider>
        </SidebarProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) => {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock Next.js router for tests
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  beforePopState: jest.fn(),
};

// Mock useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock next/navigation hooks for App Router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

export const createMockFetch = (response: any, ok = true, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
};

// Helper to reset all mocks between tests
export const resetAllMocks = () => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockClear();
  (window.localStorage.getItem as jest.Mock).mockClear();
  (window.localStorage.setItem as jest.Mock).mockClear();
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
};
