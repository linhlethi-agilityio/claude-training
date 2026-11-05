import { IconProps } from '@/types';

const MenuIcon = ({ color = '#6B7280', width = 24, height = 24, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    color={color}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path fill={color} d="M3 18h18v-2H3v2Zm0-5h18v-2H3v2Zm0-7v2h18V6H3Z" />
  </svg>
);

export { MenuIcon };
