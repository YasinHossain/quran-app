import { IconProps } from './IconProps';

export const BarsIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M16 132h416v56H16zm0 96h416v56H16zm0 96h416v56H16z" />
  </svg>
);
