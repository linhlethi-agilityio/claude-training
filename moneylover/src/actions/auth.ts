'use server';

import { AuthError } from 'next-auth';

// Constants
import { AUTH_METHODS, ERROR_MESSAGES, ERROR_TYPES } from '@/constants';

// Types
import { SignInFormData, SignUpFormData } from '@/types';

// Configs
import { signIn, signOut as signOutAuth } from '@/configs/auth';

// Libs
import { supabase } from '@/libs/supabase';

export const authenticate = async (formData: SignInFormData): Promise<void | string> => {
  try {
    await signIn(AUTH_METHODS.CREDENTIALS, {
      ...formData,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorMap: Record<string, string> = {
        [ERROR_TYPES.CREDENTIALS_SIGN_IN]: ERROR_MESSAGES.EMAIL_PASSWORD_INVALID,
      };

      return errorMap[error.type] || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
    }

    throw error;
  }
};

export const register = async (formData: SignUpFormData): Promise<void | string> => {
  const { email, password } = formData;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return error.message;
  }

  // Auto sign-in after successful registration
  return authenticate({ email, password });
};

export const signOut = async () => {
  await signOutAuth();
};
