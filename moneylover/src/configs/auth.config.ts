import type { NextAuthConfig } from 'next-auth';

// Constants
import { ROUTES } from '@/constants';

export const authConfig = {
  pages: {
    signIn: ROUTES.SIGN_IN,
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnLoginPage = nextUrl.pathname === ROUTES.SIGN_IN;
      const isOnRegisterPage = nextUrl.pathname === ROUTES.SIGN_UP;
      const isOnOnboarding = nextUrl.pathname === ROUTES.ONBOARDING;

      // If not logged in and not on auth pages, redirect to login
      if (!isLoggedIn && !isOnLoginPage && !isOnRegisterPage) {
        return Response.redirect(new URL(ROUTES.SIGN_IN, nextUrl));
      }

      // If logged in and on login or register page, redirect to dashboard
      if (isLoggedIn && (isOnLoginPage || isOnRegisterPage)) {
        return Response.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
      }

      // Allow onboarding page for logged in users
      if (isLoggedIn && isOnOnboarding) {
        return true;
      }

      return true;
    },
    async jwt({ user, token, session }) {
      if (token) Object.assign(token, user);

      if (session) Object.assign(token, session);

      return token;
    },

    async session({ session, token, newSession, trigger }) {
      Object.assign(session.user, token);

      if (trigger === 'update' && newSession?.name) session = newSession;

      return session;
    },
  },
  session: {
    maxAge: 60 * 60 * 24,
  },
  providers: [],
} satisfies NextAuthConfig;
