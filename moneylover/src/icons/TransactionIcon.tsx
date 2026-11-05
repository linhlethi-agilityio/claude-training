import { IconProps } from '@/types';

const TransactionIcon = ({
  color = '#6B7280',
  width = 24,
  height = 24,
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
    <path
      fill={color}
      d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2Zm0 14H5V5c0-.806.55-.988 1-1h13v12Z"
    />
  </svg>
);

export { TransactionIcon };
