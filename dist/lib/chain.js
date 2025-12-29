"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chain = exports.ChainManager = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const db_1 = require("./db");
const RPC_URL = 'https://sepolia.base.org';
class ChainManager {
    publicClient;
    walletClient = null; // Initialized when wallet is unlocked
    account = null;
    constructor() {
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chains_1.baseSepolia,
            transport: (0, viem_1.http)(RPC_URL)
        });
    }
    // Initialize wallet from decrypted mnemonic
    unlockWallet(mnemonic) {
        this.account = (0, accounts_1.mnemonicToAccount)(mnemonic);
        this.walletClient = (0, viem_1.createWalletClient)({
            account: this.account,
            chain: chains_1.baseSepolia,
            transport: (0, viem_1.http)(RPC_URL)
        });
        console.log(`Wallet unlocked: ${this.account.address}`);
    }
    getAddress() {
        return this.account ? this.account.address : null;
    }
    async getBalance(address) {
        const target = address || (this.account?.address);
        if (!target)
            throw new Error('No address provided and wallet locked');
        const balance = await this.publicClient.getBalance({
            address: target
        });
        return (0, viem_1.formatEther)(balance);
    }
    async getGasPrice() {
        const price = await this.publicClient.getGasPrice();
        return (0, viem_1.formatEther)(price);
    }
    async transfer(to, amount) {
        if (!this.walletClient || !this.account)
            throw new Error('Wallet locked');
        const logId = db_1.db.log('TRANSFER', { to, amount, from: this.account.address }, 'PENDING');
        try {
            const hash = await this.walletClient.sendTransaction({
                account: this.account,
                to: to,
                value: (0, viem_1.parseEther)(amount)
            });
            db_1.db.updateStatus(logId, 'SUCCESS', hash);
            return hash;
        }
        catch (error) {
            db_1.db.log('TRANSFER_ERROR', { error: error.message }, 'FAILED');
            db_1.db.updateStatus(logId, 'FAILED');
            throw error;
        }
    }
}
exports.ChainManager = ChainManager;
exports.chain = new ChainManager();
