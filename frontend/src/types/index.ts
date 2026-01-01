export interface WalletBalance {
  balance: string;
  currency: string;
}

export interface WalletAddress {
  address: string;
}

export interface TransactionResponse {
  status: string;
  txHash: string;
}

export interface TransferRequest {
  to: string;
  amount: string;
}

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  event_type: string;
  status: 'PENDING' | 'SUBMITTED' | 'SUCCESS' | 'FAILED';
  payload: unknown;
  tx_hash?: string;
  error?: string;
}
