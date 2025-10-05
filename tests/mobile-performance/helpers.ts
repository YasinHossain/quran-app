import { render, fireEvent } from '@testing-library/react';

import { perfLogger } from '@infra/monitoring';

let nowSpy: jest.SpyInstance<number, []>;
let current = 0;

beforeEach(() => {
  current = 0;
  nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => {
    current += 10;
    return current;
  });
});

afterEach(() => {
  nowSpy.mockRestore();
});

interface RenderWithPerfResult {
  utils: ReturnType<typeof render>;
  duration: number;
}

export function renderWithPerf(ui: React.ReactElement): RenderWithPerfResult {
  perfLogger.start('render');
  const utils = render(ui);
  const duration = perfLogger.end('render');
  return { utils, duration };
}

export function clickWithPerf(element: HTMLElement): number {
  perfLogger.start('interaction');
  fireEvent.click(element);
  return perfLogger.end('interaction');
}
