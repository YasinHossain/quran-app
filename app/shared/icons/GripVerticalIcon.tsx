import { GripVertical } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const GripVerticalIcon = ({
  size = 18,
  className = '',
  ...rest
}: IconProps): JSX.Element => <GripVertical size={size} className={className} {...rest} />;
