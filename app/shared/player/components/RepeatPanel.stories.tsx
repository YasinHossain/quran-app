import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RepeatPanel } from './RepeatPanel';
import type { RepeatOptions } from '../types';

export const meta: Meta<typeof RepeatPanel> = {
  title: 'Player/RepeatPanel',
  component: RepeatPanel,
};

type Story = StoryObj<typeof RepeatPanel>;

function RepeatPanelStory() {
  const [repeat, setRepeat] = useState<RepeatOptions>({ mode: 'off' });
  const [warning, setWarning] = useState<string | null>(null);
  return (
    <div className="p-4 bg-surface">
      <RepeatPanel
        localRepeat={repeat}
        setLocalRepeat={setRepeat}
        rangeWarning={warning}
        setRangeWarning={setWarning}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <RepeatPanelStory />,
};
