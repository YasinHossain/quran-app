import { ChevronRight } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const ChevronRightIcon = ({
  size = 18,
  className = '',
  ...rest
}: IconProps): JSX.Element => <ChevronRight size={size} className={className} {...rest} />;
