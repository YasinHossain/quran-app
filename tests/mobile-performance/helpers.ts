import { perfLogger } from '@infra/monitoring';
import { render, fireEvent } from '@testing-library/react';

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
