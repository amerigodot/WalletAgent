import {
  createPublicClient,
  createWalletClient,
  http,
  formatEther,
  parseEther,
  type Account,
  type Hash,
  type Address,
} from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { db } from './db';

const RPC_URL = 'https://sepolia.base.org';

export class ChainManager {
  private publicClient;
  private walletClient: any = null; // Initialized when wallet is unlocked
  private account: Account | null = null;

  constructor() {
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(RPC_URL),
    });
  }

  getWalletClient() {
    return this.walletClient;
  }

  // Initialize wallet from decrypted mnemonic
  unlockWallet(mnemonic: string) {
    this.account = mnemonicToAccount(mnemonic);
    this.walletClient = createWalletClient({
      account: this.account,
      chain: baseSepolia,
      transport: http(RPC_URL),
    });
    console.log(`Wallet unlocked: ${this.account.address}`);
  }

  getAddress(): string | null {
    return this.account ? this.account.address : null;
  }

  async getBalance(address?: string): Promise<string> {
    const target = address || this.account?.address;
    if (!target) throw new Error('No address provided and wallet locked');

    const balance = await this.publicClient.getBalance({
      address: target as Address,
    });
    return formatEther(balance);
  }

  async getGasPrice(): Promise<string> {
    const price = await this.publicClient.getGasPrice();
    return formatEther(price);
  }

  async transfer(to: string, amount: string): Promise<Hash> {
    if (!this.walletClient || !this.account) throw new Error('Wallet locked');

    const logId = db.log('TRANSFER', { to, amount, from: this.account.address }, 'PENDING');

    try {
      const hash = await this.walletClient.sendTransaction({
        account: this.account,
        to: to as Address,
        value: parseEther(amount),
      });

      db.updateStatus(logId, 'SUCCESS', hash);
      return hash;
    } catch (error: any) {
      db.log('TRANSFER_ERROR', { error: error.message }, 'FAILED');
      db.updateStatus(logId, 'FAILED');
      throw error;
    }
  }
}

export const chain = new ChainManager();
