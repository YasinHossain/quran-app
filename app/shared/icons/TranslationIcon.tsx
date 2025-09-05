import { Languages } from 'lucide-react';

import { IconProps } from './IconProps';

export const TranslationIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Languages size={size} className={className} {...rest} />
);
