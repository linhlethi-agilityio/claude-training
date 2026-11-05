import { IconProps } from '@/types';

const CheckIcon = ({ color = '#84cc16', width = 16, height = 16, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill={color}
      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z"
    />
  </svg>
);

export { CheckIcon };
