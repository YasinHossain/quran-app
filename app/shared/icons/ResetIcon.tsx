import { RotateCcw } from 'lucide-react';

import { IconProps } from './IconProps';

export const ResetIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <RotateCcw size={size} className={className} {...rest} />
);
