import { Brain } from 'lucide-react';
import { IconProps } from './IconProps';

export const BrainIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Brain size={size} className={className} {...rest} />
);
