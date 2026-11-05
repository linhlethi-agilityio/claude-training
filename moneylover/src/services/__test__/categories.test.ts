// Mocks
import { MOCK_EXPENSE_CATEGORIES, MOCK_INCOME_CATEGORIES, MOCK_SUB_CATEGORIES } from '@/mocks';

// Services
import { getCategoriesInfo } from '@/services/categories';

jest.mock('@/libs', () => ({
  getParentCategories: jest.fn(),
  getSubCategoriesByParentIds: jest.fn(),
}));

const { getParentCategories, getSubCategoriesByParentIds } = jest.requireMock('@/libs');

describe('getCategoriesInfo', () => {
  beforeEach(() => {
    getParentCategories
      .mockResolvedValueOnce(MOCK_EXPENSE_CATEGORIES)
      .mockResolvedValueOnce(MOCK_INCOME_CATEGORIES);
    getSubCategoriesByParentIds.mockResolvedValue(MOCK_SUB_CATEGORIES);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns expenseCategories, incomeCategories and subCategories', async () => {
    const result = await getCategoriesInfo('user-1');
    expect(result.expenseCategories).toEqual(MOCK_EXPENSE_CATEGORIES);
    expect(result.incomeCategories).toEqual(MOCK_INCOME_CATEGORIES);
    expect(result.subCategories).toEqual(MOCK_SUB_CATEGORIES);
  });

  it('calls getParentCategories with expense and income types in parallel', async () => {
    await getCategoriesInfo('user-1');
    expect(getParentCategories).toHaveBeenCalledTimes(2);
    expect(getParentCategories).toHaveBeenCalledWith('user-1', 'expense', undefined);
    expect(getParentCategories).toHaveBeenCalledWith('user-1', 'income', undefined);
  });

  it('calls getSubCategoriesByParentIds with all parent ids', async () => {
    await getCategoriesInfo('user-1');
    const allParentIds = [...MOCK_EXPENSE_CATEGORIES, ...MOCK_INCOME_CATEGORIES].map((c) => c.id);
    expect(getSubCategoriesByParentIds).toHaveBeenCalledWith(allParentIds);
  });

  it('passes query to getParentCategories when provided', async () => {
    await getCategoriesInfo('user-1', 'food');
    expect(getParentCategories).toHaveBeenCalledWith('user-1', 'expense', 'food');
    expect(getParentCategories).toHaveBeenCalledWith('user-1', 'income', 'food');
  });
});
