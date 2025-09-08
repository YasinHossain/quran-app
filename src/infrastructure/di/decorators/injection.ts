import { inject, injectable, named } from 'inversify';

import { TYPES, type TypeKeys } from '@/src/infrastructure/di/types';

/**
 * Injectable decorator with automatic registration
 *
 * Marks a class as injectable and available for dependency injection.
 * Use this on all classes that will be injected as dependencies.
 */
export const Injectable = (): ClassDecorator => injectable();

/**
 * Type-safe inject decorator
 *
 * Injects a dependency using type-safe symbols from TYPES.
 *
 * @param typeKey - Key from TYPES object
 * @returns Decorator function
 */
export const Inject = (typeKey: TypeKeys): ParameterDecorator & PropertyDecorator =>
  inject(TYPES[typeKey]);

/**
 * Named injection decorator
 *
 * Injects a named dependency when multiple implementations exist.
 *
 * @param typeKey - Key from TYPES object
 * @param name - Named identifier for the specific implementation
 * @returns Decorator function
 */
export const InjectNamed = (
  typeKey: TypeKeys,
  name: string
): ParameterDecorator & PropertyDecorator => {
  const injectDecorator = inject(TYPES[typeKey]);
  const namedDecorator = named(name);
  return ((target: object, key: string | symbol, index?: number) => {
    if (typeof index === 'number') {
      (injectDecorator as ParameterDecorator)(target, key, index);
      (namedDecorator as ParameterDecorator)(target, key, index);
    } else {
      (injectDecorator as PropertyDecorator)(target, key);
      (namedDecorator as PropertyDecorator)(target, key);
    }
  }) as unknown as ParameterDecorator & PropertyDecorator;
};

export { named } from 'inversify';
