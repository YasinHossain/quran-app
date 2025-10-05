import { Type } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const FontSettingIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Type size={size} className={className} {...rest} />
);
