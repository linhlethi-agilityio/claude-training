'use client';

// Components
import { Button, Modal } from '@/components';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description = '',
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <Modal isOpen={isOpen} title={title} onClose={onCancel}>
    {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  </Modal>
);
