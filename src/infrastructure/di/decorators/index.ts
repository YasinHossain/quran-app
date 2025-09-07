import {
  inject,
  lazyInject,
  optional,
  multiInject,
  named,
  postConstruct,
  preDestroy,
} from 'inversify';

import { TYPES, type TypeKeys } from '../types';

export * from './injection';
export * from './factory';

export const LazyInject = (typeKey: TypeKeys): ReturnType<typeof lazyInject> => {
  return inject(TYPES[typeKey]) && lazyInject(TYPES[typeKey]);
};

export const OptionalInject = (typeKey: TypeKeys): ReturnType<typeof optional> => {
  return inject(TYPES[typeKey]) && optional();
};

export const MultiInject = (typeKey: TypeKeys): ReturnType<typeof multiInject> => {
  return multiInject(TYPES[typeKey]);
};

export {
  named,
  optional,
  lazyInject,
  multiInject,
  postConstruct,
  preDestroy,
  postConstruct as PostConstruct,
  preDestroy as PreDestroy,
};
