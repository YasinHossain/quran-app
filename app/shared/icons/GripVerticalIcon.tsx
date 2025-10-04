import { GripVertical } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const GripVerticalIcon = ({
  size = 18,
  className = '',
  ...rest
}: IconProps): JSX.Element => <GripVertical size={size} className={className} {...rest} />;
