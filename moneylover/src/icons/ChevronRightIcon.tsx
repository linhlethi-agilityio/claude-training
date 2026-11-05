import { IconProps } from '@/types';

const ChevronRightIcon = ({
  color = '#d1d5db',
  width = 16,
  height = 16,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path fill={color} d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

export { ChevronRightIcon };
