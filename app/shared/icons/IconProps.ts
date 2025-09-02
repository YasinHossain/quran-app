import type { SVGProps } from 'react';

/**
 * Common props for all icon components
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size in pixels @default 18 */
  size?: number;
}
