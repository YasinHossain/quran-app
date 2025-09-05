import { Plus } from 'lucide-react';

import { IconProps } from './IconProps';

export const PlusIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Plus size={size} className={className} {...rest} />
);
