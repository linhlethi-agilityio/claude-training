'use server';

// Constants
import { CACHE_TAGS } from '@/constants';

import { updateTag } from 'next/cache';

// Actions
import { createCategory, updateCategory, deleteCategory } from '../category';

// Libs
import { addCategory, editCategory, removeCategory } from '@/libs';

jest.mock('@/libs', () => ({
  addCategory: jest.fn(),
  editCategory: jest.fn(),
  removeCategory: jest.fn(),
}));

describe('createCategory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addCategory and updateTag on success', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: null });

    await createCategory({ userId: 'user-1', name: 'Food', type: 'expense' });

    expect(addCategory).toHaveBeenCalledWith({
      user_id: 'user-1',
      parent_id: null,
      name: 'Food',
      type: 'expense',
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.CATEGORIES}/user-1`);
  });

  it('should call addCategory with parentId when provided', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: null });

    await createCategory({ userId: 'user-1', name: 'Fast Food', type: 'expense', parentId: '1' });

    expect(addCategory).toHaveBeenCalledWith({
      user_id: 'user-1',
      parent_id: '1',
      name: 'Fast Food',
      type: 'expense',
    });
  });

  it('should return error message when addCategory fails', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: { message: 'Insert failed' } });

    const result = await createCategory({ userId: 'user-1', name: 'Food', type: 'expense' });

    expect(result).toBe('Insert failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('updateCategory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call editCategory and updateTag on success', async () => {
    (editCategory as jest.Mock).mockResolvedValue({ error: null });

    await updateCategory({ id: '1', userId: 'user-1', name: 'Food', type: 'expense' });

    expect(editCategory).toHaveBeenCalledWith({
      id: '1',
      name: 'Food',
      type: 'expense',
      parent_id: null,
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.CATEGORIES}/user-1`);
  });

  it('should return error message when editCategory fails', async () => {
    (editCategory as jest.Mock).mockResolvedValue({ error: { message: 'Update failed' } });

    const result = await updateCategory({ id: '1', userId: 'user-1', name: 'Food', type: 'expense' });

    expect(result).toBe('Update failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('deleteCategory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call removeCategory and updateTag on success', async () => {
    (removeCategory as jest.Mock).mockResolvedValue({ error: null });

    await deleteCategory('1', 'user-1');

    expect(removeCategory).toHaveBeenCalledWith('1');
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.CATEGORIES}/user-1`);
  });

  it('should return error message when removeCategory fails', async () => {
    (removeCategory as jest.Mock).mockResolvedValue({ error: { message: 'Delete failed' } });

    const result = await deleteCategory('1', 'user-1');

    expect(result).toBe('Delete failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});
