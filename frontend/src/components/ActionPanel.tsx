import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export const ActionPanel: React.FC = () => {
  const { transfer, wrap, isLoading } = useWalletStore();
  const [mode, setMode] = useState<'TRANSFER' | 'WRAP'>('TRANSFER');

  // Form State
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      if (mode === 'TRANSFER') {
        const txHash = await transfer(to, amount);
        setStatus(`Success! Tx: ${txHash.slice(0, 10)}...`);
      } else {
        await wrap(amount);
        setStatus('Success! ETH Wrapped.');
      }
      // Reset form
      setAmount('');
      if (mode === 'TRANSFER') setTo('');
    } catch {
      // Error is handled in store, but we can show local feedback if needed
      setStatus('Operation failed. Check logs.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-1 ${mode === 'TRANSFER' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setMode('TRANSFER')}
        >
          Transfer
        </button>
        <button
          className={`pb-2 px-1 ${mode === 'WRAP' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setMode('WRAP')}
        >
          Wrap ETH
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'TRANSFER' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              required
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            step="0.000000000000000001"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isLoading ? 'Processing...' : mode === 'TRANSFER' ? 'Send Tokens' : 'Wrap ETH'}
        </button>

        {status && (
          <div
            className={`mt-4 p-3 rounded text-sm ${status.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
};
