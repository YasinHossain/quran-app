import { useState } from 'react';

import { ReciterPanel } from './ReciterPanel';

import type { Meta, StoryObj } from '@storybook/react';

export const meta: Meta<typeof ReciterPanel> = {
  title: 'Player/ReciterPanel',
  component: ReciterPanel,
};

type Story = StoryObj<typeof ReciterPanel>;

function ReciterPanelStory(): React.JSX.Element {
  const [reciter, setReciter] = useState('1');
  return (
    <div className="p-4 bg-surface">
      <ReciterPanel localReciter={reciter} setLocalReciter={setReciter} />
    </div>
  );
}

export const Default: Story = {
  render: () => <ReciterPanelStory />,
};
