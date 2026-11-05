'use client';

import { type ReactNode, useState } from 'react';

// Icons
import { ChevronRightIcon } from '@/icons';

// Utils
import { cn } from '@/utils';

interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  items: DropdownItem[];
  value?: string;
  onChange?: (item: DropdownItem) => void;
  className?: string;
}

export const Dropdown = ({
  label = '',
  placeholder = 'Select an option...',
  items,
  value = '',
  onChange,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find((item) => item.id === value);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (item: DropdownItem) => {
    onChange?.(item);
    setIsOpen(false);
  };

  const handleBlur = () => setIsOpen(false);

  return (
    <div tabIndex={0} onBlur={handleBlur} className={cn('relative', className)}>
      {label && <p className="mb-1 text-xs text-gray-400">{label}</p>}
      <div
        onClick={handleToggle}
        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-3 py-2"
      >
        <div className="flex items-center gap-3">
          {selectedItem?.icon && (
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full">{selectedItem.icon}</div>
          )}
          <span className={cn('text-sm', selectedItem ? 'text-gray-900' : 'text-gray-400')}>
            {selectedItem?.label || placeholder}
          </span>
        </div>
        <ChevronRightIcon className={cn('transition-transform', isOpen && 'rotate-90')} />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={cn(
                'flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50',
                item.id === value && 'bg-gray-50',
              )}
            >
              {item.icon && (
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                  {item.icon}
                </div>
              )}
              <span className="text-sm text-gray-900">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
