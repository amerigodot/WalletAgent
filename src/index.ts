#!/usr/bin/env node
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { AgentServer } from './api/server';
import { WalletService } from './services/wallet';

const WALLET_FILE = path.join(process.cwd(), 'wallet.enc');

async function main() {
    console.log('🤖 Agent Wallet System Starting...');
    
    const walletService = new WalletService();
    let password = '';

    if (!fs.existsSync(WALLET_FILE)) {
        console.log('✨ No wallet found. Starting setup...');
        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'password',
                message: 'Create a strong password for your new agent wallet:',
                mask: '*'
            },
            {
                type: 'password',
                name: 'confirm',
                message: 'Confirm password:',
                mask: '*'
            }
        ]);

        if (answers.password !== answers.confirm) {
            console.error('❌ Passwords do not match. Exiting.');
            process.exit(1);
        }

        password = answers.password;
        console.log('🔐 Generating secure keys...');
        await walletService.createWallet(password);
        console.log('✅ Wallet created.');
    } else {
        console.log('🔓 Wallet detected.');
        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'password',
                message: 'Enter wallet password to unlock agent interface:',
                mask: '*'
            }
        ]);
        password = answers.password;
    }

    try {
        // Test unlock
        const address = await walletService.getAddress(password);
        console.log(`\n🔑 Wallet Unlocked: ${address}`);
        
        // Start Server
        const server = new AgentServer();
        server.setPassword(password);
        server.start();

    } catch (error) {
        console.error('❌ Failed to unlock wallet. Incorrect password?');
        process.exit(1);
    }
}

main();
