"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defi = exports.DefiManager = void 0;
const viem_1 = require("viem");
const chain_1 = require("./chain");
const db_1 = require("./db");
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';
const WETH_ABI = [
    {
        name: 'deposit',
        type: 'function',
        stateMutability: 'payable',
        inputs: [],
        outputs: []
    },
    {
        name: 'withdraw',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'wad', type: 'uint256' }],
        outputs: []
    }
];
class DefiManager {
    async wrapETH(amount) {
        // @ts-ignore
        if (!chain_1.chain.walletClient)
            throw new Error('Wallet locked');
        const logId = db_1.db.log('WRAP_ETH', { amount }, 'PENDING');
        try {
            // @ts-ignore
            const hash = await chain_1.chain.walletClient.writeContract({
                address: WETH_ADDRESS,
                abi: WETH_ABI,
                functionName: 'deposit',
                value: (0, viem_1.parseEther)(amount)
            });
            db_1.db.updateStatus(logId, 'SUCCESS', hash);
            return hash;
        }
        catch (error) {
            db_1.db.log('WRAP_ERROR', { error: error.message }, 'FAILED');
            db_1.db.updateStatus(logId, 'FAILED');
            throw error;
        }
    }
    async unwrapETH(amount) {
        // @ts-ignore
        if (!chain_1.chain.walletClient)
            throw new Error('Wallet locked');
        const logId = db_1.db.log('UNWRAP_ETH', { amount }, 'PENDING');
        try {
            // @ts-ignore
            const hash = await chain_1.chain.walletClient.writeContract({
                address: WETH_ADDRESS,
                abi: WETH_ABI,
                functionName: 'withdraw',
                args: [(0, viem_1.parseEther)(amount)]
            });
            db_1.db.updateStatus(logId, 'SUCCESS', hash);
            return hash;
        }
        catch (error) {
            db_1.db.log('UNWRAP_ERROR', { error: error.message }, 'FAILED');
            db_1.db.updateStatus(logId, 'FAILED');
            throw error;
        }
    }
}
exports.DefiManager = DefiManager;
exports.defi = new DefiManager();
