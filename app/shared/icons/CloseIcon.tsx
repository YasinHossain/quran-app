import { IconProps } from './IconProps';

export const CloseIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 352 512" fill="currentColor">
    <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.3 0-44.6l-22.6-22.6c-12.3-12.3-32.3-12.3-44.6 0L176 188.7 75.9 88.6c-12.3-12.3-32.3-12.3-44.6 0L8.7 111.2c-12.3 12.3-12.3 32.3 0 44.6L108.9 256 8.7 356.1c-12.3 12.3-12.3 32.3 0 44.6l22.6 22.6c12.3 12.3 32.3 12.3 44.6 0L176 323.3l100.1 100.1c12.3 12.3 32.3 12.3 44.6 0l22.6-22.6c12.3-12.3 12.3-32.3 0-44.6L242.7 256z" />
  </svg>
);
