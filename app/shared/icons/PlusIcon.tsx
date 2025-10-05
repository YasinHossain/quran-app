import { Plus } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const PlusIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Plus size={size} className={className} {...rest} />
);
