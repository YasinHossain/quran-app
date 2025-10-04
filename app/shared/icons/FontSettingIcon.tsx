import { Type } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const FontSettingIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Type size={size} className={className} {...rest} />
);
