import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes', '@storybook/addon-coverage'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  features: {
    interactionsDebugger: true,
  },
};

export default config;
