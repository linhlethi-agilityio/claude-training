import { type Metadata } from 'next';

// Components
import { SignUpForm } from '@/components';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new Money Lover account.',
};

const SignUpPage = () => <SignUpForm />;

export default SignUpPage;
