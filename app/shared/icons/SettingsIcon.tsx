import { Settings } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const SettingsIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Settings size={size} className={className} {...rest} />
);
