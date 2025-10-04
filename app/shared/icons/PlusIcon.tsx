import { Plus } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const PlusIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Plus size={size} className={className} {...rest} />
);
