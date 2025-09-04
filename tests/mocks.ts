import { createElement, ReactNode } from 'react';

export type MockProps<P = Record<string, unknown>> = P & { children?: ReactNode };

export type MockComponent<P = Record<string, unknown>> = (props: MockProps<P>) => JSX.Element;

export const mockTag = <T extends keyof JSX.IntrinsicElements>(tag: T) =>
  ({ children, ...props }: MockProps<JSX.IntrinsicElements[T]>) =>
    createElement(tag, props, children);
