#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import * as bip39 from 'bip39';
import { security } from './lib/security';
import { db } from './lib/db';

const program = new Command();

program.name('agent-wallet').description('CLI Agent Wallet for EVM interactions').version('1.0.0');

program
  .command('setup')
  .description('Initialize the wallet (Generate or Import Mnemonic)')
  .action(async () => {
    if (security.hasKeystore()) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'A keystore already exists. Do you want to overwrite it?',
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log('Setup cancelled.');
        return;
      }
    }

    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'How would you like to set up the wallet?',
        choices: ['Generate New Mnemonic', 'Import Existing Mnemonic'],
      },
    ]);

    let mnemonic = '';

    if (mode === 'Generate New Mnemonic') {
      mnemonic = bip39.generateMnemonic();
      console.log('\n⚠️  SAVE THIS MNEMONIC SECURELY. IT WILL NOT BE SHOWN AGAIN ⚠️');
      console.log('-------------------------------------------------------------');
      console.log(mnemonic);
      console.log('-------------------------------------------------------------\n');
    } else {
      const { inputMnemonic } = await inquirer.prompt([
        {
          type: 'password', // Hide input
          name: 'inputMnemonic',
          message: 'Enter your 12 or 24 word mnemonic:',
          validate: (input) => bip39.validateMnemonic(input) || 'Invalid mnemonic',
        },
      ]);
      mnemonic = inputMnemonic;
    }

    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Enter a strong password to encrypt your keystore:',
        mask: '*',
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: 'password',
        name: 'confirm',
        message: 'Confirm password:',
        mask: '*',
      },
    ]);

    if (password !== confirm) {
      console.error('❌ Passwords do not match. Setup cancelled.');
      return;
    }

    try {
      security.saveMnemonic(mnemonic, password);
      db.log('WALLET_SETUP', { mode }, 'SUCCESS');
      console.log('\n✅ Wallet successfully set up and encrypted!');
    } catch (error: any) {
      console.error('Failed to save wallet:', error);
      db.log('WALLET_SETUP', { mode, error: error.message }, 'FAILED');
    }
  });

import { startServer } from './server';
import { chain } from './lib/chain';

// ... existing setup command ...

program
  .command('start')
  .description('Unlock wallet and start the Agent API server')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .action(async (options) => {
    if (!security.hasKeystore()) {
      console.error('❌ No wallet found. Run "setup" first.');
      process.exit(1);
    }

    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Enter wallet password to unlock:',
        mask: '*',
      },
    ]);

    const mnemonic = security.loadMnemonic(password);
    if (!mnemonic) {
      console.error('❌ Incorrect password or corrupted keystore.');
      process.exit(1);
    }

    try {
      chain.unlockWallet(mnemonic);
      startServer(parseInt(options.port));
    } catch (error) {
      console.error('Failed to start:', error);
    }
  });

program
  .command('audit')
  .description('View the local audit log')
  .action(() => {
    const logs = db.getLogs();
    console.table(logs);
  });

program.parse();
