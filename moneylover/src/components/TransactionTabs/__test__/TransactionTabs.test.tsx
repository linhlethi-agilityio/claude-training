import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { TransactionTabs } from '@/components/TransactionTabs';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(() => ({ push: mockPush })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe('TransactionTabs', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders with this month period', () => {
    const { container } = render(<TransactionTabs period="this" />);
    expect(container).toMatchSnapshot();
  });

  it('renders 3 tab buttons', () => {
    render(<TransactionTabs period="this" />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('renders THIS MONTH tab as active for "this" period', () => {
    render(<TransactionTabs period="this" />);
    const activeTab = screen.getByText('THIS MONTH');
    expect(activeTab).toHaveClass('text-lime-600');
  });

  it('renders FUTURE tab when period is future', () => {
    render(<TransactionTabs period="future" />);
    expect(screen.getByText('FUTURE')).toBeInTheDocument();
  });

  it('calls router.push with correct period param when tab is clicked', () => {
    render(<TransactionTabs period="this" />);
    fireEvent.click(screen.getByText('FUTURE'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('period=future'));
  });

  it('renders non-future next tab label when current period is last month', () => {
    render(<TransactionTabs period="last" />);
    // currentOffset=-1, nextOffset=0, isNextFuture=false → third tab shows month label
    expect(screen.queryByText('FUTURE')).not.toBeInTheDocument();
    expect(screen.getByText('THIS MONTH')).toBeInTheDocument();
  });
});
