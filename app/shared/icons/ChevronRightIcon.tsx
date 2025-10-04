import { ChevronRight } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const ChevronRightIcon = ({
  size = 18,
  className = '',
  ...rest
}: IconProps): JSX.Element => <ChevronRight size={size} className={className} {...rest} />;
