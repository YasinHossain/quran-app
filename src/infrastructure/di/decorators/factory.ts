import { TYPES, type TypeKeys } from '@/src/infrastructure/di/types';

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
// Minimal factory-creator type to avoid inversify type dependency at compile time
type MinimalContext = { container: { get<U>(id: symbol): U } };
export type FactoryCreator<T> = (context: MinimalContext) => Factory<T>;

export const createFactory = <T>(typeKey: TypeKeys): FactoryCreator<T> => {
  return (context) => {
    return () => context.container.get<T>(TYPES[typeKey]);
  };
};
