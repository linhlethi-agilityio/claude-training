'use server';

import { AuthError } from 'next-auth';

// Constants
import { ERROR_MESSAGES } from '@/constants';

// Actions
import { authenticate, register, signOut } from '../auth';

// Configs
import { signIn, signOut as signOutAuth } from '@/configs/auth';

// Libs
import { supabase } from '@/libs/supabase';

jest.mock('@/configs/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('@/libs/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe('authenticate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signIn with credentials and form data', async () => {
    (signIn as jest.Mock).mockResolvedValue(undefined);

    await authenticate({ email: 'test@example.com', password: 'password123' });

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false,
    });
  });

  it('should return error message for CredentialsSignin error', async () => {
    const error = new AuthError('CredentialsSignin');
    error.type = 'CredentialsSignin';
    (signIn as jest.Mock).mockRejectedValue(error);

    const result = await authenticate({ email: 'test@example.com', password: 'wrong' });

    expect(result).toBe(ERROR_MESSAGES.EMAIL_PASSWORD_INVALID);
  });

  it('should return generic error message for unknown AuthError type', async () => {
    const error = new AuthError('UnknownError');
    error.type = 'UnknownError' as never;
    (signIn as jest.Mock).mockRejectedValue(error);

    const result = await authenticate({ email: 'test@example.com', password: 'wrong' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
  });

  it('should rethrow non-AuthError errors', async () => {
    const error = new Error('Network error');
    (signIn as jest.Mock).mockRejectedValue(error);

    await expect(authenticate({ email: 'test@example.com', password: 'password' })).rejects.toThrow(
      'Network error',
    );
  });
});

describe('register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call supabase signUp and then authenticate on success', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({ error: null });
    (signIn as jest.Mock).mockResolvedValue(undefined);

    await register({
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password123',
    });
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'new@example.com',
      password: 'password123',
      redirect: false,
    });
  });

  it('should return error message when supabase signUp fails', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: { message: 'Email already exists' },
    });

    const result = await register({
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result).toBe('Email already exists');
    expect(signIn).not.toHaveBeenCalled();
  });
});

describe('signOut', () => {
  it('should call signOutAuth', async () => {
    (signOutAuth as jest.Mock).mockResolvedValue(undefined);

    await signOut();

    expect(signOutAuth).toHaveBeenCalled();
  });
});
