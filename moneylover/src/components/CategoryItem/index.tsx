'use client';

import { useState } from 'react';

// Icons
import { ChevronRightIcon } from '@/icons';

// Types
import { Category } from '@/types';

// Components
import { MenuActions } from '@/components';

// UI
import { CategoryInfo } from '@/components';

interface CategoryItemProps {
  category: Category;
  subCategories?: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
}

export const CategoryItem = ({
  category,
  subCategories = [],
  onEdit,
  onDelete,
}: CategoryItemProps) => {
  const { name, image_url, id } = category;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = subCategories.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
  };

  const handleDeleteCategory = () => {
    onDelete?.(id);
  };

  const handleEditCategory = () => {
    onEdit?.(category);
  };

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
        onClick={handleToggle}
      >
        <CategoryInfo name={name} imageUrl={image_url} />
        <div className="flex-1" />
        {!category.is_default && (
          <MenuActions onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
        )}
        {hasChildren && (
          <ChevronRightIcon className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        )}
      </div>

      {isExpanded && (
        <div className="border-b border-gray-100 bg-gray-50 pl-8">
          {subCategories.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 last:border-b-0"
            >
              <CategoryInfo name={sub.name} imageUrl={sub.image_url} size="sm" />
              <div className="flex-1" />
              <MenuActions onEdit={() => onEdit?.(sub)} onDelete={() => onDelete?.(sub.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
