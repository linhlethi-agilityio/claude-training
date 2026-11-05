import { type ButtonHTMLAttributes, type Ref } from 'react';

// Utils
import { cn } from '@/utils';

// Components
import { LoadingIndicator } from '@/components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const variants = {
  default: 'bg-lime-600 text-white hover:bg-lime-700',
  outline: 'border border-lime-600 bg-white text-lime-600 hover:bg-lime-50',
  ghost: 'bg-transparent text-tx-primary hover:bg-white hover:text-tx-primary',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

export const Button = ({
  className,
  variant = 'default',
  size = 'md',
  isLoading,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-md transition-colors cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {isLoading && <LoadingIndicator size="sm" className="border-current border-t-transparent" />}
    {children}
  </button>
);
