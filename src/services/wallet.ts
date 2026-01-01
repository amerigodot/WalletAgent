import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { createPublicClient, createWalletClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';
import { EncryptionService } from '../utils/encryption';
import * as dotenv from 'dotenv';

dotenv.config();

const WALLET_FILE_PATH = path.join(process.cwd(), 'wallet.enc');

export class WalletService {
  private client;

  constructor() {
    this.client = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.RPC_URL || 'https://sepolia.base.org'),
    });
  }

  async getWalletClient(password: string) {
    const account = await this.loadWallet(password);
    return createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.RPC_URL || 'https://sepolia.base.org'),
    });
  }

  /**
   * Returns the public client.
   * Note: In a real implementation, we might not need the password just for the client,
   * but we pass it to ensure the caller has context or to unlock a signer if it were separate.
   */
  async getClient(password: string) {
    // Verify password correctness by attempting to decrypt (simple auth check)
    await this.loadWallet(password);
    return this.client;
  }

  /**
   * Creates a new wallet, encrypts it with the password, and saves it to disk.
   */
  async createWallet(password: string): Promise<string> {
    // 1. Generate Mnemonic
    const mnemonic = generateMnemonic(english);

    // 2. Encrypt
    const encryptedData = await EncryptionService.encrypt(mnemonic, password);

    // 3. Save to Disk
    fs.writeFileSync(WALLET_FILE_PATH, encryptedData);

    // Return address for display
    const account = mnemonicToAccount(mnemonic);
    return account.address;
  }

  /**
   * Loads the wallet from disk and decrypts it.
   */
  async loadWallet(password: string) {
    if (!fs.existsSync(WALLET_FILE_PATH)) {
      throw new Error('No wallet found. Please run setup first.');
    }

    const encryptedData = fs.readFileSync(WALLET_FILE_PATH, 'utf-8');
    const mnemonic = await EncryptionService.decrypt(encryptedData, password);

    return mnemonicToAccount(mnemonic);
  }

  async getAddress(password: string): Promise<string> {
    const account = await this.loadWallet(password);
    return account.address;
  }

  async getBalance(password: string): Promise<string> {
    const account = await this.loadWallet(password);
    const balance = await this.client.getBalance({ address: account.address });
    return formatEther(balance);
  }
}
