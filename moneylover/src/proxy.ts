import NextAuth from 'next-auth';

import { authConfig } from '@/configs/auth.config';

export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$|.*\\.webp$).*)'],
};
