// Configs
import { auth } from '@/configs/auth';

// Components
import { WalletForm } from '@/components';

export const OnboardingContent = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? '';

  return <WalletForm userId={userId} />;
};
