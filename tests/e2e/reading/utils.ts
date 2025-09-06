export interface MockPage {
  goto(url: string): Promise<void>;
  click(selector: string): Promise<void>;
  waitForURL(pattern: string): Promise<void>;
  locator(selector: string): {
    count(): Promise<number>;
    textContent(): Promise<string | null>;
    isVisible(): Promise<boolean>;
  };
  waitForSelector(selector: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  keyboard: { press(key: string): Promise<void> };
}

export const createMockPage = (): MockPage => {
  const mockLocator = jest.fn(() => ({
    count: jest.fn().mockResolvedValue(7),
    textContent: jest.fn().mockResolvedValue('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),
    isVisible: jest.fn().mockResolvedValue(true),
  }));

  return {
    goto: jest.fn(),
    click: jest.fn(),
    waitForURL: jest.fn(),
    locator: mockLocator,
    waitForSelector: jest.fn(),
    fill: jest.fn(),
    keyboard: { press: jest.fn() },
  };
};
