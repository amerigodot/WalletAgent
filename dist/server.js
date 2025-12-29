"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const chain_1 = require("./lib/chain");
const defi_1 = require("./lib/defi");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Middleware to ensure wallet is unlocked
const ensureUnlocked = (req, res, next) => {
    if (!chain_1.chain.getAddress()) {
        return res.status(503).json({ error: 'Wallet not initialized/locked' });
    }
    next();
};
app.get('/agent/address', ensureUnlocked, (req, res) => {
    res.json({ address: chain_1.chain.getAddress() });
});
app.get('/agent/balance', ensureUnlocked, async (req, res) => {
    try {
        const balance = await chain_1.chain.getBalance();
        res.json({ balance, currency: 'ETH' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/agent/transfer', ensureUnlocked, async (req, res) => {
    const { to, amount } = req.body;
    if (!to || !amount)
        return res.status(400).json({ error: 'Missing to or amount' });
    try {
        const hash = await chain_1.chain.transfer(to, amount);
        res.json({ status: 'success', txHash: hash });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/agent/wrap', ensureUnlocked, async (req, res) => {
    const { amount } = req.body;
    if (!amount)
        return res.status(400).json({ error: 'Missing amount' });
    try {
        const hash = await defi_1.defi.wrapETH(amount);
        res.json({ status: 'success', txHash: hash });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/agent/unwrap', ensureUnlocked, async (req, res) => {
    const { amount } = req.body;
    if (!amount)
        return res.status(400).json({ error: 'Missing amount' });
    try {
        const hash = await defi_1.defi.unwrapETH(amount);
        res.json({ status: 'success', txHash: hash });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const startServer = (port) => {
    app.listen(port, () => {
        console.log(`\n🤖 Agent Wallet API running on http://localhost:${port}`);
        console.log('Endpoints:');
        console.log(' - GET  /agent/balance');
        console.log(' - POST /agent/transfer { to, amount }');
        console.log(' - POST /agent/wrap { amount }');
    });
};
exports.startServer = startServer;
