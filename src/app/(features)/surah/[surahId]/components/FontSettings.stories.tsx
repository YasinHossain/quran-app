import type { Meta, StoryObj } from '@storybook/react';
import { FontSettings } from './FontSettings';
import { SettingsProvider } from '@/presentation/providers/SettingsContext';

const meta: Meta<typeof FontSettings> = {
  title: 'Settings/FontSettings',
  component: FontSettings,
  decorators: [
    (Story) => (
      <SettingsProvider>
        <div className="p-4 bg-surface text-foreground">
          <Story />
        </div>
      </SettingsProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FontSettings>;

export const Default: Story = {
  args: {
    onArabicFontPanelOpen: () => {},
  },
};
