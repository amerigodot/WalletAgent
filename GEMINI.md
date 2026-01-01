🧠 Explicit Memory Block: Agent Wallet Protocol
Project Definition Agent Wallet is a secure, programmable infrastructure designed as a "Bank Account for Bots." It serves as a bridge between AI logic and decentralized finance (DeFi), operating on the EVM (Base Sepolia) with a focus on autonomous agent sovereignty.

Core Architecture

Local-First & Encrypted: Uses Argon2id (KDF) and XSalsa20-Poly1305 (via libsodium) to encrypt private keys at rest (wallet.enc). No central server; keys never leave the local environment.
Programmable Interface: Exposes a local REST API (http://localhost:3000) for agents to check identity, track assets, and sign transactions programmatically.
Auditable State: Maintains a persistent SQLite database (agent_wallet.db) logging all lifecycle events, decisions, and transaction outcomes (PENDING -> SUCCESS/FAILED).
Privacy Specifications (The "Privacy-First" Standard)

End-to-End Encryption (E2EE): All agent-to-agent and agent-to-human communications are encrypted.
Decentralized Identity (DID): Agents utilize self-sovereign identities to remain verifiable but unlinkable to human operators without consent.
Traffic Obfuscation: Mandates the use of Tor/I2P proxying to resist traffic analysis and IP tracking.
Data Minimization: "Ephemeral by default" data handling—sensitive inputs are processed in memory and overwritten immediately.
Operational Guidelines

Initialization: Wallet is created via CLI (npm start) with a strong password. This password unlocks the API for the session.
Agent Interaction:
Verify: GET /agent/address (Confirms unlock status & identity).
Execute: POST /agent/transfer (Signs & broadcasts transactions).
Audit: GET /agent/audit (Polls for transaction confirmation).
Human Supervision: A React-based Dashboard (http://localhost:5173) provides a "Human-in-the-Loop" view for monitoring balances and intervening if necessary.
Security Protocols

Key Isolation: Private keys are never exposed in logs or API responses.
Sanctions Screening: Agents perform local checks against sanctions lists to ensure compliance without leaking intent.
Compliance: Supports "Selective Disclosure" via view keys for regulatory auditing while maintaining public anonymity.

# Agent Wallet - Research Context

## Directory Overview
This directory contains research and thesis papers from Coinbase Ventures exploring the convergence of Cryptocurrency and Artificial Intelligence. The materials focus on the emergence of the "Agentic Web," where AI agents operate on crypto infrastructure to drive economic activity.

## Key Files

### 1. `Demystifying the Crypto x AI Stack.pdf`
**Date:** October 2024
**Summary:**
This document outlines the core thesis for the "Crypto x AI" stack. It argues that while blockchain isn't required for every layer of the AI stack, it provides critical benefits in distribution, verifiability, censorship resistance, and native payment rails.

**Key Segments:**
*   **Decentralized AI (Crypto -> AI):** Building generic AI infrastructure (compute, data, models) on decentralized networks.
*   **Onchain AI (AI -> Crypto):** Integrating AI into the crypto ecosystem to improve user/developer experiences and smart contract capabilities.
*   **The Stack Layers:**
    *   **Compute:** Decentralized GPU networks (e.g., Akash, io.net).
    *   **Data:** Decentralized access, orchestration, and storage (e.g., Filecoin, Ocean Protocol).
    *   **Middleware:** Networks for developing and deploying AI agents (e.g., Bittensor, Morpheus).
    *   **Applications:** User-facing products leveraging onchain AI.

### 2. `F5A276CD-9278-4A98-B92C-B22989D9FE70.pdf`
**Title:** The Rise of Onchain AI: Agents, Apps, and Commerce
**Date:** May 16, 2025
**Summary:**
This paper builds upon the previous thesis, focusing specifically on "Onchain AI" as a rapidly growing sector. It posits that autonomous AI agents are the new "users" of blockchains, capable of operating 24/7 and making sophisticated decisions.

**Key Concepts:**
*   **Onchain AI Agents:** Autonomous programs with crypto wallets that can hold tokens, transact, and govern.
*   **Agentic Commerce:** A new mode of commerce where agents transact with each other and humans using blockchain rails (stablecoins, smart contracts).
*   **Infrastructure:** Trusted Execution Environments (TEEs), Agent Frameworks (e.g., ElizaOS, Coinbase AgentKit), and Agent Launchpads.
*   **Types of Agents:** Trading/DeFi agents, Service agents, and Entertainment agents (NPCs, influencers).

## Key Terminology
*   **Agentic Web:** A paradigm where AI agents are significant drivers of economic activity.
*   **DeAI (Decentralized AI):** Democratizing access to AI resources via blockchain.
*   **Onchain AI:** AI agents and apps that use crypto rails for payments and state.
*   **Data DAOs:** Onchain entities where users govern and monetize their data.

## Usage
These documents serve as the theoretical and architectural foundation for the "Agent Wallet" project. They define the ecosystem, necessary infrastructure, and potential use cases for building AI agents that can transact onchain.
