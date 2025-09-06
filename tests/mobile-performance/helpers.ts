import { perfLogger } from '@infra/monitoring';
import { render, fireEvent } from '@testing-library/react';

export function renderWithPerf(ui: React.ReactElement) {
  perfLogger.start('render');
  const utils = render(ui);
  const duration = perfLogger.end('render');
  return { utils, duration };
}

export function clickWithPerf(element: HTMLElement) {
  perfLogger.start('interaction');
  fireEvent.click(element);
  return perfLogger.end('interaction');
}
