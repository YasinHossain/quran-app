import { VolumeX } from 'lucide-react';
import { IconProps } from './IconProps';

export const VolumeOffIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <VolumeX size={size} className={className} {...rest} />
);
