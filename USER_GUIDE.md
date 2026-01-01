# Agent Wallet: User & Agent Guide

Welcome to the **Agent Wallet**. This guide is designed for both human operators and autonomous agents to understand how to set up, secure, and operate the wallet.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) installed on your machine.
- **npm** (Node Package Manager).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/amerigodimaria/WalletAgent.git
    cd agent-wallet
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up the frontend:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

---

## 🔐 Wallet Management

### Setting Up a New Wallet

### Setting Up a New Wallet

1.  **Initialize:** Run the interactive setup wizard:
    ```bash
    npm run setup
    ```
2.  **Wizard Steps:**
    - Choose **Generate New Mnemonic** (or Import Existing).
    - Save your mnemonic securely (it won't be shown again).
    - Set a **Strong Password** to encrypt your keystore.
3.  **Start:** Once setup is complete, launch the wallet:
    ```bash
    npm start
    ```
    - Enter your password to unlock the interface.

### Backing Up & Restoring

Currently, the wallet is stored as an encrypted file (`wallet.enc`).

- **To Backup:** Copy the `wallet.enc` file to a secure location (USB drive, secure cloud storage).
- **To Restore:** Place your backup `wallet.enc` file into the root `agent-wallet/` directory. When you run `npm start`, use the original password you set during creation to unlock it.

> **⚠️ Important:** If you lose both your `wallet.enc` file and your password, your funds are unrecoverable.

---

## 💻 Human Dashboard (Frontend)

The Agent Wallet includes a web-based dashboard for human supervision.

### Starting the Dashboard

1.  Ensure the backend is running (`npm start` in the root folder).
2.  Open a new terminal window.
3.  Navigate to the frontend and start the dev server:
    ```bash
    cd frontend
    npm run dev
    ```
4.  Open your browser to `http://localhost:5173`.

### Features

- **Check Balance:** The dashboard automatically polls for your ETH balance and displays it at the top.
- **Send Transactions:**
  1.  Go to the **Action Panel**.
  2.  Select **Transfer**.
  3.  Enter the **Recipient Address** (starting with `0x...`) and the **Amount** in ETH.
  4.  Click **Send Tokens**.
- **Wrap/Unwrap ETH:** Use the "Wrap ETH" tab to convert native ETH to WETH (ERC-20) for DeFi interactions.
- **View History:** The **Activity Log** at the bottom shows real-time events, including successful transactions and any errors.

### Privacy Configuration
Agents can manage their anonymity settings via the API.
- **View Settings:** `GET /agent/privacy`
- **Update Settings:** `POST /agent/privacy` (e.g., `{"useTor": true}`)

---

## 🤖 Agent Integration (API)

Autonomous agents can interact with the wallet using the local REST API.

**Base URL:** `http://localhost:3000`

### 1. Check Identity & Balance

Agents should first verify they are connected to the correct wallet and have sufficient funds.

**Request:**

```http
GET /agent/address
GET /agent/balance
```

### 2. Perform Transactions

To send funds, the agent sends a POST request.

**Endpoint:** `POST /agent/transfer`
**Payload:**

```json
{
  "to": "0x1234567890123456789012345678901234567890",
  "amount": "0.05"
}
```

### 3. Monitor Activity

Agents can poll the audit log to verify if their previous actions succeeded.

**Endpoint:** `GET /agent/audit`

---

## ❓ Troubleshooting

**Issue: "Wallet locked" error via API**

- **Cause:** The server was started, but the wallet wasn't unlocked via the CLI prompt.
- **Fix:** Check the terminal running `npm start`. You must enter the password to unlock the wallet before the API accepts requests.

**Issue: "Cannot GET /"**

- **Cause:** The server might be running an older version or the wrong port.
- **Fix:** Ensure you are accessing `http://localhost:3000` (Backend) or `http://localhost:5173` (Frontend). Restart the server.

**Issue: Transaction Fails (Gas Error)**

- **Cause:** Insufficient ETH for gas fees.
- **Fix:** Ensure you leave a small amount of ETH remaining (don't send "Max").

---

_Secure. Autonomous. Agentic._
