import express, { Request, Response } from 'express';
import cors from 'cors';
import { WalletService } from '../services/wallet';
import { TransactionService } from '../services/transaction';
import { AuditService } from '../database/audit';

export class AgentServer {
    private app;
    private port = process.env.PORT || 3000;
    private walletService: WalletService;
    private transactionService: TransactionService;
    private auditService: AuditService;
    private walletPassword = '';

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        // Request Logger Middleware
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
            next();
        });

        this.walletService = new WalletService();
        this.auditService = new AuditService();
        this.transactionService = new TransactionService(this.walletService, this.auditService);

        this.setupRoutes();
    }

    public setPassword(password: string) {
        this.walletPassword = password;
    }

    private setupRoutes() {
        // Root Route - API Status
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                status: 'running',
                service: 'Agent Wallet Interface',
                version: '1.0.0',
                endpoints: [
                    'GET /agent/address',
                    'GET /agent/balance',
                    'POST /agent/transfer',
                    'POST /agent/wrap',
                    'POST /agent/unwrap'
                ]
            });
        });

        // GET /agent/address
        this.app.get('/agent/address', async (req: Request, res: Response) => {
            try {
                if (!this.walletPassword) throw new Error('Wallet locked');
                const address = await this.walletService.getAddress(this.walletPassword);
                res.json({ address });
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });

        // GET /agent/balance
        this.app.get('/agent/balance', async (req: Request, res: Response) => {
            try {
                if (!this.walletPassword) throw new Error('Wallet locked');
                const balance = await this.walletService.getBalance(this.walletPassword);
                res.json({ balance, currency: 'ETH' });
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });

        // POST /agent/transfer
        this.app.post('/agent/transfer', async (req: Request, res: Response) => {
            try {
                if (!this.walletPassword) throw new Error('Wallet locked');
                const { to, amount } = req.body;
                if (!to || !amount) throw new Error('Missing parameters: to, amount');

                const txHash = await this.transactionService.transferETH(this.walletPassword, to, amount);
                res.json({ status: 'success', txHash });
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });

        // POST /agent/wrap (Placeholder)
        this.app.post('/agent/wrap', async (req: Request, res: Response) => {
            try {
                if (!this.walletPassword) throw new Error('Wallet locked');
                const { amount } = req.body;
                await this.transactionService.wrapETH(this.walletPassword, amount);
                res.json({ status: 'success' });
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });

        // POST /agent/unwrap (Placeholder)
        this.app.post('/agent/unwrap', async (req: Request, res: Response) => {
             res.status(501).json({ error: 'Not implemented' });
        });
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Agent Interface running at http://localhost:${this.port}`);
        });
    }
}
