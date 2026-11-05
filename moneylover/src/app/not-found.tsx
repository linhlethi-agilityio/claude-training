import Link from 'next/link';

// Constants
import { ROUTES } from '@/constants';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
    <p className="text-8xl font-bold text-lime-600">404</p>
    <h1 className="text-2xl font-semibold text-gray-800">Page not found</h1>
    <p className="text-sm text-gray-500">The page you are looking for does not exist.</p>
    <Link
      href={ROUTES.DASHBOARD}
      className="mt-2 rounded-lg bg-lime-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-700"
    >
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
