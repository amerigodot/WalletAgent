# Agent Wallet

Agent Wallet is a secure, programmable foundation for **Onchain AI Agents**. It provides the essential infrastructure for autonomous programs to manage keys, track assets, and execute transactions on EVM-compatible blockchains.

Built on the principles of the **Agentic Web**, this wallet serves as the bridge between AI logic and decentralized finance.

## 🎯 Project Scope

The primary goal is to provide a "Bank Account for Bots" that is:
- **Secure:** Hardened key management using AES-256 encryption.
- **Programmable:** Local API server for agents to request onchain actions.
- **Auditable:** Persistent SQLite-based logging of every decision and transaction.
- **EVM-Native:** Initial focus on **Base** (EVM) for low-cost, high-speed execution.

## 🚀 Key Features

- **Encrypted Key Management:** Secure generation and local storage of private keys.
- **Real-time Asset Tracking:** Monitor native ETH and ERC-20 balances.
- **Programmatic Signing:** REST API for agents to transfer funds and interact with contracts.
- **DeFi Ready:** Built-in support for basic DeFi protocols (e.g., WETH wrapping/unwrapping).
- **Intelligent Gas Logic:** Automatic gas estimation and optimization for agentic speed.
- **Comprehensive Auditing:** Every transaction is logged with its intent and outcome.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Blockchain:** Viem (EVM interaction)
- **Database:** Better-SQLite3 (Audit logs)
- **CLI:** Commander.js
- **API:** Express.js

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/agent-wallet.git
   cd agent-wallet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   RPC_URL=https://sepolia.base.org
   ENCRYPTION_KEY=your-secure-passphrase-here
   PORT=3000
   ```

4. **Initialize Wallet:**
   ```bash
   npm run wallet -- setup
   ```

## 📖 Usage

### CLI Commands
- `npm run wallet -- setup`: Generate a new encrypted wallet.
- `npm run wallet -- balance`: Show current wallet assets.
- `npm run wallet -- audit`: Display recent transaction history.

### Agent API (Server Mode)
Start the server to allow your AI agent to interact with the wallet:
```bash
npm run start:server
```

**Example API Call (Transfer):**
```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"to": "0x...", "amount": "0.01"}'
```

## 🤝 Contribution Guidelines

We welcome contributions to the Agentic Web!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
*Built for the rise of Onchain AI Agents.*
