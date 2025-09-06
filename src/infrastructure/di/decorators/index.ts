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

export const LazyInject = (typeKey: TypeKeys) => {
  return inject(TYPES[typeKey]) && lazyInject(TYPES[typeKey]);
};

export const OptionalInject = (typeKey: TypeKeys) => {
  return inject(TYPES[typeKey]) && optional();
};

export const MultiInject = (typeKey: TypeKeys) => {
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
