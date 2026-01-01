import axios from 'axios';
import type { WalletAddress, WalletBalance, TransferRequest, TransactionResponse } from '../types';

const api = axios.create({
  baseURL: '/agent', // Proxied by Vite to http://localhost:3000/agent
  headers: {
    'Content-Type': 'application/json',
  },
});

import type { AuditLogEntry } from '../types';

export const walletApi = {
  getAddress: async (): Promise<WalletAddress> => {
    const response = await api.get<WalletAddress>('/address');
    return response.data;
  },

  getBalance: async (): Promise<WalletBalance> => {
    const response = await api.get<WalletBalance>('/balance');
    return response.data;
  },

  transfer: async (data: TransferRequest): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transfer', data);
    return response.data;
  },

  wrapETH: async (amount: string): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/wrap', { amount });
    return response.data;
  },

  unwrapETH: async (amount: string): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/unwrap', { amount });
    return response.data;
  },

  getAuditLogs: async (): Promise<{ logs: AuditLogEntry[] }> => {
    const response = await api.get<{ logs: AuditLogEntry[] }>('/audit');
    return response.data;
  },
};
