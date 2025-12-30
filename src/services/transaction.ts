import { WalletService } from '../services/wallet';
import { AuditService } from '../database/audit';
import { parseEther, isAddress } from 'viem';

export class TransactionService {
    constructor(
        private walletService: WalletService,
        private auditService: AuditService
    ) {}

    async transferETH(password: string, to: string, amount: string) {
        const payload = { to, amount, asset: 'ETH' };
        
        try {
            // 1. Validate
            if (!isAddress(to)) throw new Error('Invalid recipient address');
            if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) throw new Error('Invalid amount');

            // 2. Log PENDING
            this.auditService.log('TRANSFER', 'PENDING', payload);

            // 3. Execute
            const client = await this.walletService.getWalletClient(password);
            
            const hash = await client.sendTransaction({
                to: to as `0x${string}`,
                value: parseEther(amount)
            });

            // 4. Log SUBMITTED/SUCCESS (Simplified for prototype, assuming hash means submitted)
            this.auditService.log('TRANSFER', 'SUCCESS', payload, hash);
            return hash;

        } catch (error: any) {
            this.auditService.log('TRANSFER', 'FAILED', payload, undefined, error.message);
            throw error;
        }
    }

    // Placeholder for WETH wrapping implementation
    async wrapETH(password: string, amount: string) {
        const payload = { amount, action: 'WRAP' };
        this.auditService.log('WRAP_ETH', 'PENDING', payload);
        // Implementation would involve WETH contract interaction
        // For prototype, we'll just log failure as it's not fully implemented in WalletService yet
        const error = "WETH Wrapping not fully implemented in prototype";
        this.auditService.log('WRAP_ETH', 'FAILED', payload, undefined, error);
        throw new Error(error);
    }
}
