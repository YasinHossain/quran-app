import { SkipBack } from 'lucide-react';
import { IconProps } from './IconProps';

export const SkipBackIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <SkipBack size={size} className={className} {...rest} />
);
