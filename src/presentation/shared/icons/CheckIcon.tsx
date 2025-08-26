import { IconProps } from './IconProps';

export const CheckIcon = ({ size = 18, className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M173.898 439.404L166.39 432l-24.5-24.5-137.13-137.13L.74 242.5l11.314 11.314L134.5 374.3l24.5 24.5 24.5 24.5 137.13-137.13L349.5 270.5l-11.314-11.314L173.898 439.404zM504.26 105.4l-11.314 11.314L370.5 239.3l-24.5 24.5-24.5-24.5-137.13-137.13L171.898 81.4l11.314-11.314L247.5 126.3l24.5-24.5 137.13-137.13L479.26 78.5l11.314 11.314L389.5 199.3l11.314 11.314z" />
  </svg>
);
