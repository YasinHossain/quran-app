import { ChevronUp } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const ChevronUpIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <ChevronUp size={size} className={className} {...rest} />
);
