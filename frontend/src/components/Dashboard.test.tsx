import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { describe, it, expect, vi } from 'vitest';

// Mock the store
vi.mock('../store/walletStore', () => ({
  useWalletStore: () => ({
    address: '0x123',
    balance: '10.0',
    currency: 'ETH',
    fetchWalletData: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe('Dashboard Component', () => {
  it('renders address and balance correctly', () => {
    render(<Dashboard />);

    expect(screen.getByText('Agent Wallet')).toBeInTheDocument();
    expect(screen.getByText('0x123')).toBeInTheDocument();
    expect(screen.getByText('10.0')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });
});
