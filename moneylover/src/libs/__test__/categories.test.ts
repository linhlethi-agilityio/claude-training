// Types
import { FinanceType } from '@/types';

// Mocks
import { MOCK_EXPENSE_CATEGORIES, MOCK_SUB_CATEGORIES } from '@/mocks';

// Libs
import {
  getParentCategories,
  getSubCategoriesByParentIds,
  addCategory,
  editCategory,
  removeCategory,
} from '@/libs/categories';

jest.mock('@/libs/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
  },
}));

const getSupabase = () => jest.requireMock('@/libs/supabase').supabase;

beforeEach(() => {
  jest.clearAllMocks();
  const s = getSupabase();
  ['from', 'select', 'insert', 'update', 'delete', 'eq', 'is', 'in', 'ilike'].forEach((method) =>
    s[method].mockReturnThis(),
  );
});

describe('getParentCategories', () => {
  it('returns categories on success', async () => {
    getSupabase().is.mockResolvedValueOnce({ data: MOCK_EXPENSE_CATEGORIES });
    const result = await getParentCategories('user-1', FinanceType.Expense);
    expect(result).toEqual(MOCK_EXPENSE_CATEGORIES);
  });

  it('returns empty array when data is null', async () => {
    getSupabase().is.mockResolvedValueOnce({ data: null });
    const result = await getParentCategories('user-1', FinanceType.Expense);
    expect(result).toEqual([]);
  });

  it('queries with userId and type', async () => {
    getSupabase().is.mockResolvedValueOnce({ data: [] });
    await getParentCategories('user-1', FinanceType.Expense);
    expect(getSupabase().from).toHaveBeenCalledWith('categories');
    expect(getSupabase().eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(getSupabase().eq).toHaveBeenCalledWith('type', FinanceType.Expense);
  });

  it('applies ilike filter when query is provided', async () => {
    getSupabase().ilike.mockResolvedValueOnce({ data: [] });
    await getParentCategories('user-1', FinanceType.Expense, 'food');
    expect(getSupabase().ilike).toHaveBeenCalledWith('name', '%food%');
  });
});

describe('getSubCategoriesByParentIds', () => {
  it('returns sub categories on success', async () => {
    getSupabase().in.mockResolvedValueOnce({ data: MOCK_SUB_CATEGORIES });
    const result = await getSubCategoriesByParentIds(['1', '2']);
    expect(result).toEqual(MOCK_SUB_CATEGORIES);
  });

  it('returns empty array when parentIds is empty', async () => {
    const result = await getSubCategoriesByParentIds([]);
    expect(result).toEqual([]);
    expect(getSupabase().from).not.toHaveBeenCalled();
  });

  it('returns empty array when data is null', async () => {
    getSupabase().in.mockResolvedValueOnce({ data: null });
    const result = await getSubCategoriesByParentIds(['1']);
    expect(result).toEqual([]);
  });
});

describe('addCategory', () => {
  it('returns no error on success', async () => {
    getSupabase().insert.mockResolvedValueOnce({ error: null });
    const result = await addCategory({
      user_id: 'user-1',
      name: 'Food',
      type: FinanceType.Expense,
      parent_id: null,
    });
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    getSupabase().insert.mockResolvedValueOnce({ error: 'DB error' });
    const result = await addCategory({
      user_id: 'user-1',
      name: 'Food',
      type: FinanceType.Expense,
    });
    expect(result.error).toBe('DB error');
  });
});

describe('editCategory', () => {
  const params = { id: '1', user_id: 'user-1', name: 'Updated', type: FinanceType.Expense };

  it('returns no error and found on success', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [{ id: '1' }], error: null });
    const result = await editCategory(params);
    expect(result).toEqual({ error: null, found: true });
  });

  it('returns error on failure', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: null, error: 'DB error' });
    const result = await editCategory(params);
    expect(result.error).toBe('DB error');
  });

  it('filters update by id and owner', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [{ id: '1' }], error: null });
    await editCategory(params);
    expect(getSupabase().eq).toHaveBeenCalledWith('id', '1');
    expect(getSupabase().eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('only re-parents sub categories owned by the user', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [{ id: '1' }], error: null });
    await editCategory({ ...params, parent_id: '2' });
    expect(getSupabase().update).toHaveBeenNthCalledWith(1, { parent_id: '2' });
    expect(getSupabase().eq).toHaveBeenNthCalledWith(1, 'parent_id', '1');
    expect(getSupabase().eq).toHaveBeenNthCalledWith(2, 'user_id', 'user-1');
  });

  it('returns found false when no owned row matches', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [], error: null });
    const result = await editCategory({ ...params, id: 'other' });
    expect(result).toEqual({ error: null, found: false });
  });
});

describe('removeCategory', () => {
  it('returns no error and found on success', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [{ id: 'cat-1' }], error: null });
    const result = await removeCategory('cat-1', 'user-1');
    expect(result).toEqual({ error: null, found: true });
  });

  it('filters delete by id and owner', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [{ id: 'cat-1' }], error: null });
    await removeCategory('cat-1', 'user-1');
    expect(getSupabase().from).toHaveBeenCalledWith('categories');
    expect(getSupabase().delete).toHaveBeenCalled();
    expect(getSupabase().eq).toHaveBeenCalledWith('id', 'cat-1');
    expect(getSupabase().eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('returns found false when no owned row matches', async () => {
    getSupabase().select.mockResolvedValueOnce({ data: [], error: null });
    const result = await removeCategory('cat-other', 'user-1');
    expect(result).toEqual({ error: null, found: false });
  });
});
