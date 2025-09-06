import { withThemeByClassName } from '@storybook/addon-themes';

import type { Preview } from '@storybook/react';

import '../app/globals.css';
import '../app/theme.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
