import { type Metadata } from 'next';
import { Suspense } from 'react';

// Components
import { HomeSkeleton } from '@/components';

// UI
import { HomeContent } from '@/ui/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your wallets and recent transactions.',
};

const DashboardPage = () => {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
};

export default DashboardPage;
