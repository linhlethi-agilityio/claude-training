// Types
import { type IToast } from '@/contexts/ToastProvider';

// Icons
import { CloseIcon } from '@/icons';

// Utils
import { cn } from '@/utils';

// Components
import { Button } from '@/components';

const statusStyles = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
};

interface ToastProps extends IToast {
  onClose: (id: string) => void;
}

export const Toast = ({ id, title, description, status, onClose }: ToastProps) => {
  const style = statusStyles[status];

  const handleClose = () => {
    onClose(id);
  };

  return (
    <div className={cn('flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg', style)}>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs opacity-75">{description}</p>}
      </div>
      <Button
        variant="ghost"
        onClick={handleClose}
        className="h-auto p-0 shrink-0 opacity-50 hover:opacity-100"
      >
        <CloseIcon color="currentColor" />
      </Button>
    </div>
  );
};
