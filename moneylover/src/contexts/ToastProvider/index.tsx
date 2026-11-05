'use client';

import { type ReactNode, useId, useRef, useState, createContext } from 'react';

// Constants
import { TOAST_DURATION } from '@/constants';

// Components
import { Toast } from '@/components';

export type ToastStatus = 'success' | 'error' | 'info';

export interface IToast {
  id: string;
  title: string;
  description?: string;
  status: ToastStatus;
  duration?: number;
}

export type TToastContext = {
  toasts: IToast[];
  showToast: (toast: Omit<IToast, 'id'>) => void;
  closeToast: (id: string) => void;
};

export const ToastContext = createContext({} as TToastContext);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const baseId = useId();
  const counterRef = useRef(0);
  const [toasts, setToasts] = useState<IToast[]>([]);

  const showToast = ({
    title,
    description,
    status,
    duration = TOAST_DURATION,
  }: Omit<IToast, 'id'>) => {
    const id = `${baseId}-${counterRef.current++}`;

    setToasts((prev) => [...prev, { id, title, description, status, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const closeToast = (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ toasts, showToast, closeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={closeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
