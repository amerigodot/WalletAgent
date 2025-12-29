#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const bip39 = __importStar(require("bip39"));
const security_1 = require("./lib/security");
const db_1 = require("./lib/db");
const program = new commander_1.Command();
program
    .name('agent-wallet')
    .description('CLI Agent Wallet for EVM interactions')
    .version('1.0.0');
program
    .command('setup')
    .description('Initialize the wallet (Generate or Import Mnemonic)')
    .action(async () => {
    if (security_1.security.hasKeystore()) {
        const { overwrite } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'A keystore already exists. Do you want to overwrite it?',
                default: false
            }
        ]);
        if (!overwrite) {
            console.log('Setup cancelled.');
            return;
        }
    }
    const { mode } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'How would you like to set up the wallet?',
            choices: ['Generate New Mnemonic', 'Import Existing Mnemonic']
        }
    ]);
    let mnemonic = '';
    if (mode === 'Generate New Mnemonic') {
        mnemonic = bip39.generateMnemonic();
        console.log('\n⚠️  SAVE THIS MNEMONIC SECURELY. IT WILL NOT BE SHOWN AGAIN ⚠️');
        console.log('-------------------------------------------------------------');
        console.log(mnemonic);
        console.log('-------------------------------------------------------------\n');
    }
    else {
        const { inputMnemonic } = await inquirer_1.default.prompt([
            {
                type: 'password', // Hide input
                name: 'inputMnemonic',
                message: 'Enter your 12 or 24 word mnemonic:',
                validate: (input) => bip39.validateMnemonic(input) || 'Invalid mnemonic'
            }
        ]);
        mnemonic = inputMnemonic;
    }
    const { password } = await inquirer_1.default.prompt([
        {
            type: 'password',
            name: 'password',
            message: 'Enter a strong password to encrypt your keystore:',
            mask: '*'
        },
        {
            type: 'password',
            name: 'confirm',
            message: 'Confirm password:',
            mask: '*',
            validate: (input, answers) => {
                return input === answers.password || 'Passwords do not match';
            }
        }
    ]);
    try {
        security_1.security.saveMnemonic(mnemonic, password);
        db_1.db.log('WALLET_SETUP', { mode }, 'SUCCESS');
        console.log('\n✅ Wallet successfully set up and encrypted!');
    }
    catch (error) {
        console.error('Failed to save wallet:', error);
        db_1.db.log('WALLET_SETUP', { mode, error: error.message }, 'FAILED');
    }
});
const server_1 = require("./server");
const chain_1 = require("./lib/chain");
// ... existing setup command ...
program
    .command('start')
    .description('Unlock wallet and start the Agent API server')
    .option('-p, --port <number>', 'Port to listen on', '3000')
    .action(async (options) => {
    if (!security_1.security.hasKeystore()) {
        console.error('❌ No wallet found. Run "setup" first.');
        process.exit(1);
    }
    const { password } = await inquirer_1.default.prompt([
        {
            type: 'password',
            name: 'password',
            message: 'Enter wallet password to unlock:',
            mask: '*'
        }
    ]);
    const mnemonic = security_1.security.loadMnemonic(password);
    if (!mnemonic) {
        console.error('❌ Incorrect password or corrupted keystore.');
        process.exit(1);
    }
    try {
        chain_1.chain.unlockWallet(mnemonic);
        (0, server_1.startServer)(parseInt(options.port));
    }
    catch (error) {
        console.error('Failed to start:', error);
    }
});
program
    .command('audit')
    .description('View the local audit log')
    .action(() => {
    const logs = db_1.db.getLogs();
    console.table(logs);
});
program.parse();
