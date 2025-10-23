import { Sparkles } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const SparklesIcon = ({ size = 20, className = '', ...rest }: IconProps): JSX.Element => (
  <Sparkles size={size} className={className} {...rest} />
);
