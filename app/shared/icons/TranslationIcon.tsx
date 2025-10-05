import { Languages } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const TranslationIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Languages size={size} className={className} {...rest} />
);
