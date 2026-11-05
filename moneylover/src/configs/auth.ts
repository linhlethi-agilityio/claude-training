import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Constants
import { PROCESS_ENV } from '@/constants';

// Types
import { SignInFormData } from '@/types';

// Config
import { authConfig } from '@/configs/auth.config';

// Libs
import { supabase } from '@/libs/supabase';

const CredentialsProvider = Credentials({
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  authorize: async (credentials) => {
    const { email, password } = credentials as SignInFormData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email,
    };
  },
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: PROCESS_ENV.AUTH_SECRET,
  providers: [CredentialsProvider],
  session: {
    maxAge: 30 * 60, // 30 minutes
  },
});
