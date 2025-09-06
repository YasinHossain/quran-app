import { inject, injectable, named } from 'inversify';

import { TYPES, type TypeKeys } from '../types';

/**
 * Injectable decorator with automatic registration
 *
 * Marks a class as injectable and available for dependency injection.
 * Use this on all classes that will be injected as dependencies.
 */
export const Injectable = () => injectable();

/**
 * Type-safe inject decorator
 *
 * Injects a dependency using type-safe symbols from TYPES.
 *
 * @param typeKey - Key from TYPES object
 * @returns Decorator function
 */
export const Inject = (typeKey: TypeKeys) => inject(TYPES[typeKey]);

/**
 * Named injection decorator
 *
 * Injects a named dependency when multiple implementations exist.
 *
 * @param typeKey - Key from TYPES object
 * @param name - Named identifier for the specific implementation
 * @returns Decorator function
 */
export const InjectNamed = (typeKey: TypeKeys, name: string) => {
  return inject(TYPES[typeKey]) && named(name);
};

export { named } from 'inversify';
