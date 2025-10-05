import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  test,
} from '@jest/globals';

export { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test };

export const vi = jest;

const vitestApi = {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
  vi,
};

export default vitestApi;
