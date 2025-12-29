import { 
    parseEther, 
    type Address, 
    type Hash 
} from 'viem';
import { chain } from './chain';
import { db } from './db';

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
] as const;

export class DefiManager {
    
    async wrapETH(amount: string): Promise<Hash> {
        // @ts-ignore
        if (!chain.walletClient) throw new Error('Wallet locked');

        const logId = db.log('WRAP_ETH', { amount }, 'PENDING');

        try {
            // @ts-ignore
            const hash = await chain.walletClient.writeContract({
                address: WETH_ADDRESS,
                abi: WETH_ABI,
                functionName: 'deposit',
                value: parseEther(amount)
            });

            db.updateStatus(logId, 'SUCCESS', hash);
            return hash;
        } catch (error: any) {
            db.log('WRAP_ERROR', { error: error.message }, 'FAILED');
            db.updateStatus(logId, 'FAILED');
            throw error;
        }
    }

    async unwrapETH(amount: string): Promise<Hash> {
        // @ts-ignore
        if (!chain.walletClient) throw new Error('Wallet locked');

        const logId = db.log('UNWRAP_ETH', { amount }, 'PENDING');

        try {
            // @ts-ignore
            const hash = await chain.walletClient.writeContract({
                address: WETH_ADDRESS,
                abi: WETH_ABI,
                functionName: 'withdraw',
                args: [parseEther(amount)]
            });

            db.updateStatus(logId, 'SUCCESS', hash);
            return hash;
        } catch (error: any) {
            db.log('UNWRAP_ERROR', { error: error.message }, 'FAILED');
            db.updateStatus(logId, 'FAILED');
            throw error;
        }
    }
}

export const defi = new DefiManager();
