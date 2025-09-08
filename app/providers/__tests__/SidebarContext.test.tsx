import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SidebarProvider, useSidebar } from '@/app/providers/SidebarContext';

const ScrollTest = (): React.ReactElement => {
  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  return (
    <div>
      <div data-testid="surah">{surahScrollTop}</div>
      <button onClick={() => setSurahScrollTop(100)}>Surah</button>
      <div data-testid="juz">{juzScrollTop}</div>
      <button onClick={() => setJuzScrollTop(200)}>Juz</button>
      <div data-testid="page">{pageScrollTop}</div>
      <button onClick={() => setPageScrollTop(300)}>Page</button>
    </div>
  );
};

describe('SidebarContext scroll positions', () => {
  beforeEach(() => {
    let store: Record<string, string> = {};
    const mockSessionStorage = {
      getItem: jest.fn((key: string) => store[key]),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      key: jest.fn(),
      length: 0,
    } as unknown as Storage;

    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    });
  });

  it('updates surahScrollTop and writes to sessionStorage', async () => {
    render(
      <SidebarProvider>
        <ScrollTest />
      </SidebarProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Surah' }));
    await waitFor(() => {
      expect(screen.getByTestId('surah').textContent).toBe('100');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('surahScrollTop', '100');
    });
  });

  it('updates juzScrollTop and writes to sessionStorage', async () => {
    render(
      <SidebarProvider>
        <ScrollTest />
      </SidebarProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Juz' }));
    await waitFor(() => {
      expect(screen.getByTestId('juz').textContent).toBe('200');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('juzScrollTop', '200');
    });
  });

  it('updates pageScrollTop and writes to sessionStorage', async () => {
    render(
      <SidebarProvider>
        <ScrollTest />
      </SidebarProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page' }));
    await waitFor(() => {
      expect(screen.getByTestId('page').textContent).toBe('300');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('pageScrollTop', '300');
    });
  });
});
