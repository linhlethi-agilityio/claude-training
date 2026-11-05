// Utils
import { cn } from '@/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md';
  className?: string;
  variant?: 'inline' | 'overlay';
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
};

const Spinner = ({ size, className }: { size: 'sm' | 'md'; className?: string }) => (
  <div
    className={cn(
      'animate-spin rounded-full border-lime-500 border-t-transparent',
      sizes[size],
      className,
    )}
  />
);

export const LoadingIndicator = ({
  size = 'md',
  className,
  variant = 'inline',
}: LoadingIndicatorProps) => {
  return variant === 'overlay' ? (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white">
      <Spinner size={size} className={className} />
    </div>
  ) : (
    <Spinner size={size} className={className} />
  );
};
