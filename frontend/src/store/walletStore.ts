import { create } from 'zustand';
import { walletApi } from '../api/client';
import type { AuditLogEntry } from '../types';
import { AxiosError } from 'axios';

interface WalletState {
  address: string | null;
  balance: string | null;
  currency: string;
  auditLogs: AuditLogEntry[];
  isLoading: boolean;
  error: string | null;

  fetchWalletData: () => Promise<void>;
  transfer: (to: string, amount: string) => Promise<string>;
  wrap: (amount: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  balance: null,
  currency: 'ETH',
  auditLogs: [],
  isLoading: false,
  error: null,

  fetchWalletData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [addressData, balanceData, logsData] = await Promise.all([
        walletApi.getAddress(),
        walletApi.getBalance(),
        walletApi.getAuditLogs(),
      ]);
      set({
        address: addressData.address,
        balance: balanceData.balance,
        currency: balanceData.currency,
        auditLogs: logsData.logs,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof AxiosError
        ? error.response?.data?.error || error.message
        : (error as Error).message || 'Failed to fetch wallet data';

      set({
        error: message,
        isLoading: false,
      });
    }
  },

  transfer: async (to: string, amount: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletApi.transfer({ to, amount });
      await get().fetchWalletData(); // Refresh balance
      set({ isLoading: false });
      return response.txHash;
    } catch (error) {
      const message = error instanceof AxiosError
        ? error.response?.data?.error || error.message
        : (error as Error).message || 'Transfer failed';

      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  wrap: async (amount: string) => {
    set({ isLoading: true, error: null });
    try {
      await walletApi.wrapETH(amount);
      await get().fetchWalletData();
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof AxiosError
        ? error.response?.data?.error || error.message
        : (error as Error).message || 'Wrap failed';

      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },
}));
