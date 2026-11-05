import { render, waitFor } from '@testing-library/react';

// Configs
import { auth } from '@/configs/auth';

// UI
import { OnboardingContent } from '../index';

describe('OnboardingContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render WalletForm with userId and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });

    const { container } = render(await OnboardingContent());

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should render WalletForm with empty userId when session is null', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const { container } = render(await OnboardingContent());

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
