'use client';

import { type ReactNode } from 'react';

// Icons
import { CloseIcon } from '@/icons';

// Components
import { Button } from '@/components';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <CloseIcon />
            </Button>
          </div>
          {children}
        </div>
      </div>
    )
  );
};
