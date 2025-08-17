import { Pin } from 'lucide-react';
import { IconProps } from './IconProps';

export const PinIcon = ({ size = 18, className = '' }: IconProps) => (
  <Pin size={size} className={className} />
);
