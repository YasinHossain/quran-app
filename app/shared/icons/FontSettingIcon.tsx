import { Type } from 'lucide-react';

import { IconProps } from './IconProps';

export const FontSettingIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Type size={size} className={className} {...rest} />
);
