import { Languages } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const TranslationIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Languages size={size} className={className} {...rest} />
);
