import express from 'express';
import { chain } from './lib/chain';
import { defi } from './lib/defi';
import { privacy } from './lib/privacy';

const app = express();
app.use(express.json());

// Middleware to ensure wallet is unlocked
const ensureUnlocked = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!chain.getAddress()) {
    return res.status(503).json({ error: 'Wallet not initialized/locked' });
  }
  next();
};

app.get('/agent/address', ensureUnlocked, (req, res) => {
  res.json({ address: chain.getAddress() });
});

app.get('/agent/balance', ensureUnlocked, async (req, res) => {
  try {
    const balance = await chain.getBalance();
    res.json({ balance, currency: 'ETH' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/agent/transfer', ensureUnlocked, async (req, res) => {
  const { to, amount } = req.body;
  if (!to || !amount) return res.status(400).json({ error: 'Missing to or amount' });

  try {
    const hash = await chain.transfer(to, amount);
    res.json({ status: 'success', txHash: hash });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/agent/wrap', ensureUnlocked, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'Missing amount' });

  try {
    const hash = await defi.wrapETH(amount);
    res.json({ status: 'success', txHash: hash });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/agent/unwrap', ensureUnlocked, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'Missing amount' });

  try {
    const hash = await defi.unwrapETH(amount);
    res.json({ status: 'success', txHash: hash });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/agent/privacy', ensureUnlocked, (req, res) => {
  res.json(privacy.getSettings());
});

app.post('/agent/privacy', ensureUnlocked, (req, res) => {
  const newSettings = req.body;
  if (!newSettings || Object.keys(newSettings).length === 0) {
    return res.status(400).json({ error: 'Missing settings payload' });
  }
  const updated = privacy.updateSettings(newSettings);
  res.json(updated);
});

export const startServer = (port: number) => {
  app.listen(port, () => {
    console.log(`\n🤖 Agent Wallet API running on http://localhost:${port}`);
    console.log('Endpoints:');
    console.log(' - GET  /agent/balance');
    console.log(' - POST /agent/transfer { to, amount }');
    console.log(' - POST /agent/wrap { amount }');
    console.log(' - GET  /agent/privacy');
    console.log(' - POST /agent/privacy { ...settings }');
  });
};
