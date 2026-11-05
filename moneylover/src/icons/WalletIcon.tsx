import { IconProps } from '@/types';

const WalletIcon = ({
  color = '#6B7280',
  width = 24,
  height = 24,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    color={color}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill={color}
      d="M21 7H3V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3Zm0 2v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9h18Zm-5 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Z"
    />
  </svg>
);

export { WalletIcon };
