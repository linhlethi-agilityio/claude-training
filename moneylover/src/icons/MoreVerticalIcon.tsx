import { IconProps } from '@/types';

const MoreVerticalIcon = ({ color = '#9CA3AF', width = 20, height = 20, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx="12" cy="5" r="1.5" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="12" cy="19" r="1.5" fill={color} />
  </svg>
);

export { MoreVerticalIcon };
