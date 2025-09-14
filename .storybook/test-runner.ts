import { checkA11y, injectAxe } from 'axe-playwright';

import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
  tags: {
    include: ['test'],
    exclude: ['!test'],
    skip: ['skip-test'],
  },
};

export default config;
