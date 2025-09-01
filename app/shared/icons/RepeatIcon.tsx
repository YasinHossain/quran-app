import { Repeat } from 'lucide-react';
import { IconProps } from './IconProps';

export const RepeatIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Repeat size={size} className={className} {...rest} />
);

