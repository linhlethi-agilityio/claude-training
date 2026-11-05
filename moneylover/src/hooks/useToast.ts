// Libs
import { use } from 'react';

// Contexts
import { ToastContext, type TToastContext } from '@/contexts/ToastProvider';

export const useToast = (): TToastContext => use(ToastContext);
