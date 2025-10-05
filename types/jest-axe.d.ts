import type { AxeResults, RunOptions } from 'axe-core';

type AxeNode = Element | Document | DocumentFragment | ShadowRoot | string;

declare module 'jest-axe' {
  export function axe(node?: AxeNode, options?: RunOptions): Promise<AxeResults>;
  export function toHaveNoViolations(...results: AxeResults[]): jest.CustomMatcherResult;
}

declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }

  interface Expect {
    toHaveNoViolations(): void;
  }
}
