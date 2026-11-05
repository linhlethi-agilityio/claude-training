import { fireEvent, render, screen } from '@testing-library/react';
import { use } from 'react';

// Hooks
import { useToast } from '@/hooks/useToast';

// Contexts
import ToastProvider, { ToastContext } from '@/contexts/ToastProvider';

// Components
import { Button } from '@/components';

const ToastConsumer = () => {
  const { showToast } = useToast();
  const { toasts } = use(ToastContext);

  return (
    <div>
      <Button onClick={() => showToast({ title: 'Hello', status: 'success' })}>trigger</Button>
      {toasts.map((t) => (
        <span key={t.id} data-testid="toast">
          {t.title}
        </span>
      ))}
    </div>
  );
};

describe('useToast', () => {
  it('returns showToast that adds a toast via context', () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('trigger'));
    expect(screen.getByTestId('toast')).toHaveTextContent('Hello');
  });
});
