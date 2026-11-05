import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';

// Utils
import { cn } from '@/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightIcon?: ReactNode;
  errorMessage?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({
  label,
  className,
  id,
  rightIcon,
  errorMessage,
  ref,
  ...props
}: InputProps) => (
  <div>
    {label && (
      <label htmlFor={id} className="mb-1 block text-xs text-gray-400">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-lg border border-gray-400 px-3 py-2 text-sm text-gray-900',
          'placeholder:text-gray-300',
          'focus:border-lime-600 focus:outline-none',
          'disabled:cursor-not-allowed disabled:border-gray-200 disabled:opacity-50',
          rightIcon && 'pr-10',
          errorMessage && 'border-red-500 focus:border-red-500',
          className,
        )}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</span>
      )}
    </div>
    {errorMessage && <p className="mt-1 min-h-[16px] text-xs text-red-500">{errorMessage}</p>}
  </div>
);
