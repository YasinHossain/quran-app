import { render, RenderOptions } from '@testing-library/react';
import { renderHook, RenderHookOptions } from '@testing-library/react';
import React from 'react';

import { createProviderWrapper, ContextProviderName } from './providers';

export function renderWithSpecificProviders(
  ui: React.ReactElement,
  providers: ContextProviderName[],
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = createProviderWrapper(providers, { provider: () => new Map() });
  return render(ui, { wrapper: Wrapper, ...options });
}

export function renderHookWithProviders<TProps, TResult>(
  callback: (props: TProps) => TResult,
  providers: ContextProviderName[],
  options?: RenderHookOptions<TProps>
) {
  const Wrapper = createProviderWrapper(providers, { provider: () => new Map() });
  return renderHook(callback, { wrapper: Wrapper, ...options });
}

