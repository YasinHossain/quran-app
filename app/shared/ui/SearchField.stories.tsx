import { useState } from 'react';

import { SearchField } from './SearchField';
import preview from '../../../.storybook/preview';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchField> = {
  title: 'Shared/UI/SearchField',
  component: SearchField,
  decorators: [...(preview.decorators || [])],
};

export default meta;

type Story = StoryObj<typeof meta>;

function DefaultComponent(args: React.ComponentProps<typeof SearchField>): React.JSX.Element {
  const [term, setTerm] = useState('');
  return <SearchField {...args} searchTerm={term} setSearchTerm={setTerm} />;
}

export const Default: Story = {
  render: (args) => <DefaultComponent {...args} />,
  args: {
    placeholder: 'Search...',
  },
};
