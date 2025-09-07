import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import preview from '../../../.storybook/preview';
import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Shared/UI/SearchField',
  component: SearchField,
  decorators: [...(preview.decorators || [])],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [term, setTerm] = useState('');
    return <SearchField {...args} searchTerm={term} setSearchTerm={setTerm} />;
  },
  args: {
    placeholder: 'Search...'
  }
};
