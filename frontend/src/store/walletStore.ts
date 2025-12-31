import { create } from 'zustand';
import { walletApi } from '../api/client';

interface WalletState {
    address: string | null;
    balance: string | null;
    currency: string;
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
    isLoading: false,
    error: null,

    fetchWalletData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [addressData, balanceData] = await Promise.all([
                walletApi.getAddress(),
                walletApi.getBalance()
            ]);
            set({ 
                address: addressData.address, 
                balance: balanceData.balance,
                currency: balanceData.currency,
                isLoading: false 
            });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.error || error.message || 'Failed to fetch wallet data', 
                isLoading: false 
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
        } catch (error: any) {
            set({ 
                error: error.response?.data?.error || error.message || 'Transfer failed', 
                isLoading: false 
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
         } catch (error: any) {
             set({
                 error: error.response?.data?.error || error.message || 'Wrap failed',
                 isLoading: false
             });
             throw error;
         }
    }
}));
