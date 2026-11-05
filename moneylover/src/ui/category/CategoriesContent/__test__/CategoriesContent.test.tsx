import { render, waitFor } from '@testing-library/react';

// Mocks
import { MOCK_EXPENSE_CATEGORIES, MOCK_INCOME_CATEGORIES, MOCK_SUB_CATEGORIES } from '@/mocks';

// Services
import { getCategoriesInfo } from '@/services';

// Configs
import { auth } from '@/configs/auth';

// UI
import { CategoriesContent } from '../index';

jest.mock('@/services', () => ({
  ...jest.requireActual('@/services'),
  getCategoriesInfo: jest.fn(),
}));

describe('CategoriesContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render CategoryList with data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getCategoriesInfo as jest.Mock).mockResolvedValue({
      expenseCategories: MOCK_EXPENSE_CATEGORIES,
      incomeCategories: MOCK_INCOME_CATEGORIES,
      subCategories: MOCK_SUB_CATEGORIES,
    });

    const { container } = render(await CategoriesContent({}));

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should render CategoryList with empty data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getCategoriesInfo as jest.Mock).mockResolvedValue({
      expenseCategories: [],
      incomeCategories: [],
      subCategories: [],
    });

    const { container } = render(await CategoriesContent({ query: 'food' }));

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
