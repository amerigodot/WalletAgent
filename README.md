# Agent Wallet

Agent Wallet is a secure, programmable foundation for **Onchain AI Agents**. It provides the essential infrastructure for autonomous programs to manage keys, track assets, and execute transactions on EVM-compatible blockchains.

Built on the principles of the **Agentic Web**, this wallet serves as the bridge between AI logic and decentralized finance.

## 🎯 Project Scope

The primary goal is to provide a "Bank Account for Bots" that is:

- **Secure:** Military-grade key management using Argon2id KDF and XSalsa20-Poly1305 encryption via libsodium.
- **Programmable:** Local REST API server for agents to request onchain actions.
- **Auditable:** Persistent SQLite-based logging of every decision and transaction with a state machine (PENDING -> SUCCESS/FAILED).
- **EVM-Native:** Initial focus on **Base** (EVM) for low-cost, high-speed execution.

## 🚀 Key Features

- **Advanced Cryptography:** Argon2id (memory-hard KDF) and authenticated encryption to protect private keys.
- **Real-time Asset Tracking:** Monitor native ETH and ERC-20 balances via API.
- **Programmatic Signing:** REST API for agents to transfer funds and interact with contracts.
- **Audit System:** Integrated SQLite database (`agent_wallet.db`) tracking all lifecycle events.
- **EVM-Compatible:** Built-in support for Base Sepolia and other EVM chains.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Blockchain:** Viem (EVM interaction)
- **Database:** Better-SQLite3 (Audit logs)
- **Encryption:** libsodium-wrappers, argon2
- **API:** Express.js

## 📦 Installation

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/amerigodot/WalletAgent.git
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
   PORT=3000
   ```

## 📚 Documentation

For detailed instructions on setup, backup/restore, and usage, please refer to the **[User & Agent Guide](USER_GUIDE.md)**.

## 📖 Usage

### Starting the Wallet

Run the following command to start the secure environment:

```bash
npm start
```

- If it's your first time, you will be prompted to set a password and a new wallet will be generated.
- If a wallet exists, you must provide your password to unlock the agent interface.

### Agent API

Once the wallet is unlocked, the server exposes the machine-readable interface at `http://localhost:3000/agent/`.

**Check Balance:**

```bash
curl http://localhost:3000/agent/balance
```

**Execute Transfer:**

```bash
curl -X POST http://localhost:3000/agent/transfer \
  -H "Content-Type: application/json" \
  -d '{"to": "0x...", "amount": "0.01"}'
```

## 🔐 Privacy & Security

This project follows the **Privacy-First Agent Wallet** specification, ensuring end-to-end encryption for all sensitive state and anonymous execution capabilities.

## 🤝 Contribution Guidelines

We welcome contributions to the Agentic Web!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

_Built for the rise of Onchain AI Agents._
