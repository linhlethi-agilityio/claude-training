import { type Metadata } from 'next';

// Components
import { SignInForm } from '@/components';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Money Lover account.',
};

const SignInPage = () => <SignInForm />;

export default SignInPage;
