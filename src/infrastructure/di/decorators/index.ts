import { inject, optional, multiInject, named, postConstruct, preDestroy } from 'inversify';

import { TYPES, type TypeKeys } from '@/src/infrastructure/di/types';

export * from './injection';
// Note: factory helpers are not used in the current DI setup

export const OptionalInject = (typeKey: TypeKeys): ReturnType<typeof optional> => {
  return inject(TYPES[typeKey]) && optional();
};

export const MultiInject = (typeKey: TypeKeys): ReturnType<typeof multiInject> => {
  return multiInject(TYPES[typeKey]);
};

export {
  named,
  optional,
  multiInject,
  postConstruct,
  preDestroy,
  postConstruct as PostConstruct,
  preDestroy as PreDestroy,
};
