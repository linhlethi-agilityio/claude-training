'use client';

import { type MouseEvent, useEffect, useRef, useState } from 'react';

// Icons
import { MoreVerticalIcon } from '@/icons';

// Components
import { Button } from '@/components';

interface MenuActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MenuActions = ({ onEdit, onDelete }: MenuActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit?.();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="sm" onClick={handleToggle} className="h-6 w-6 p-0">
        <MoreVerticalIcon />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-28 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="w-full justify-start rounded-none px-3 py-1.5 text-xs text-gray-700"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="w-full justify-start rounded-none px-3 py-1.5 text-xs text-red-500 hover:text-red-500"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
