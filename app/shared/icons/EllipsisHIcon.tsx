import { MoreHorizontal } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const EllipsisHIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <MoreHorizontal size={size} className={className} {...rest} />
);
