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

const renderScrollTest = (): void => {
  render(
    <SidebarProvider>
      <ScrollTest />
    </SidebarProvider>
  );
};

const clickAndAssertScroll = async (
  buttonName: string,
  testId: string,
  storageKey: string,
  value: string
): Promise<void> => {
  renderScrollTest();
  await userEvent.click(screen.getByRole('button', { name: buttonName }));
  await waitFor(() => {
    expect(screen.getByTestId(testId).textContent).toBe(value);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(storageKey, value);
  });
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
    await clickAndAssertScroll('Surah', 'surah', 'surahScrollTop', '100');
  });

  it('updates juzScrollTop and writes to sessionStorage', async () => {
    await clickAndAssertScroll('Juz', 'juz', 'juzScrollTop', '200');
  });

  it('updates pageScrollTop and writes to sessionStorage', async () => {
    await clickAndAssertScroll('Page', 'page', 'pageScrollTop', '300');
  });
});
