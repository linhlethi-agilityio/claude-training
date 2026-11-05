'use client';

import Link from 'next/link';

// Constants
import { ROUTES } from '@/constants';

// Utils
import { cn } from '@/utils';

// Components
import { Button } from '@/components';

interface ErrorProps {
  error: (Error & { digest?: string }) | string;
  reset?: () => void;
  className?: string;
}

export const ErrorBoundary = ({ error, reset, className }: ErrorProps) => {
  const handleReset = () => {
    reset?.();
  };

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <section
      className={cn(
        'flex h-screen flex-col items-center justify-center bg-white text-center',
        className,
      )}
    >
      <h2 className="text-4xl font-bold text-gray-900">Something went wrong!</h2>
      {errorMessage && <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>}
      <div className="mt-8 flex gap-4">
        <Button onClick={handleReset}>Try again</Button>
        <Link href={ROUTES.DASHBOARD}>
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </section>
  );
};
