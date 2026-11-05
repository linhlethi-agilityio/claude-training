'use client';

import { useState, useTransition } from 'react';

// Types
import { Category, FinanceType } from '@/types';

// Utils
import { cn } from '@/utils';

// Constants
import { CATEGORY_TYPES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

// Actions
import { deleteCategory } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Components
import { Button, Modal, ConfirmModal, CategoryItem, CategoryForm } from '@/components';

interface CategoryListProps {
  userId: string;
  expenseCategories: Category[];
  incomeCategories: Category[];
  subCategories: Category[];
}

export const CategoryList = ({
  userId,
  expenseCategories,
  incomeCategories,
  subCategories,
}: CategoryListProps) => {
  const [activeTab, setActiveTab] = useState<FinanceType>(FinanceType.Expense);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const categoriesMap = {
    [FinanceType.Expense]: expenseCategories,
    [FinanceType.Income]: incomeCategories,
  };

  const activeCategories = categoriesMap[activeTab];

  const subCategoriesMap = subCategories.reduce<Record<string, Category[]>>((acc, sub) => {
    const key = sub.parent_id ?? '';
    (acc[key] ??= []).push(sub);
    return acc;
  }, {});

  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const handleEdit = (category: Category) => setEditCategory(category);
  const handleCloseEdit = () => setEditCategory(null);

  const handleDelete = (id: string) => setDeleteCategoryId(id);

  const handleCloseConfirmModal = () => setDeleteCategoryId(null);

  const handleConfirmDelete = () => {
    if (!deleteCategoryId) return;

    startTransition(async () => {
      const error = await deleteCategory(deleteCategoryId, userId);

      setDeleteCategoryId(null);

      if (error) {
        return showToast({
          status: 'error',
          title: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          description: error,
        });
      }

      showToast({
        status: 'success',
        title: SUCCESS_MESSAGES.CATEGORY_DELETED,
      });
    });
  };

  const categoryToDelete = [...expenseCategories, ...incomeCategories, ...subCategories].find(
    (c) => c.id === deleteCategoryId,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-lg bg-gray-200 p-1">
        {CATEGORY_TYPES.map(({ key, label }) => (
          <Button
            key={key}
            variant="ghost"
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex-1 rounded-md py-2 text-sm font-medium',
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm hover:bg-white'
                : 'bg-transparent text-gray-500 hover:bg-transparent hover:text-gray-700',
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      <Button variant="outline" className="w-full" onClick={handleOpenModal}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-100 text-xs text-lime-600">
          +
        </span>
        New category
      </Button>

      {activeCategories.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No categories yet</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          {activeCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              subCategories={subCategoriesMap[category.id] ?? []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen title="New Category" onClose={handleCloseModal}>
          <CategoryForm
            userId={userId}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            onSubmit={handleCloseModal}
          />
        </Modal>
      )}

      {editCategory && (
        <Modal isOpen title="Edit Category" onClose={handleCloseEdit}>
          <CategoryForm
            userId={userId}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            previewData={editCategory}
            onSubmit={handleCloseEdit}
          />
        </Modal>
      )}

      {deleteCategoryId && (
        <ConfirmModal
          isOpen
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}
    </div>
  );
};
