import { Brain } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const BrainIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Brain size={size} className={className} {...rest} />
);
