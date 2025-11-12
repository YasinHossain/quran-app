import { Calendar } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const CalendarIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Calendar size={size} className={className} {...rest} />
);
