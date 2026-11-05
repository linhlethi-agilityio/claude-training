import { type ReactNode } from 'react';
import Image from 'next/image';

// Constants
import { BRAND_NAME, IMAGES } from '@/constants';

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="flex min-h-screen flex-col bg-gray-100">
    <div className="flex flex-col items-center gap-4 bg-green-700 px-4 pb-25 pt-15">
      <Image
        src={IMAGES.MONEYLOVER_LOGO}
        alt={BRAND_NAME}
        width={80}
        height={80}
        className="rounded-2xl"
      />
      <h1 className="text-3xl font-bold text-white">{BRAND_NAME}</h1>
    </div>

    <div className="mx-auto -mt-15 w-full max-w-lg rounded-xl bg-white p-10 shadow-lg">
      {children}
    </div>
  </div>
);

export default AuthLayout;
