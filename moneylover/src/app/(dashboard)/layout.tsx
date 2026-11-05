import { type ReactNode, Suspense } from 'react';

// Layouts
import { Sidebar } from '@/layouts';

// Components
import { LoadingIndicator } from '@/components';

// UI
import { DashboardContent } from '@/ui/dashboard';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <LoadingIndicator />
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  </div>
);

export default DashboardLayout;
