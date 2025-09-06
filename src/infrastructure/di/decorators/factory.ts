import type { interfaces } from 'inversify';

import { TYPES, type TypeKeys } from '../types';

export type Factory<T> = () => T;
export type AsyncFactory<T> = () => Promise<T>;
export type FactoryWithArgs<T, Args extends unknown[]> = (...args: Args) => T;

/**
 * Factory decorator helper
 *
 * Creates a factory function for creating instances with parameters.
 *
 * @param typeKey - Key from TYPES object
 * @returns Factory decorator
 */
export const createFactory = <T>(
  typeKey: TypeKeys,
): interfaces.FactoryCreator<T> => {
  return (context: interfaces.Context) => {
    return () => context.container.get<T>(TYPES[typeKey]);
  };
};
