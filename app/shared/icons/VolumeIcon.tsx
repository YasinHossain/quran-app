import { Volume2 } from 'lucide-react';
import { IconProps } from './IconProps';

export const VolumeIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Volume2 size={size} className={className} {...rest} />
);

