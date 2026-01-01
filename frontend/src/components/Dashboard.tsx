import React, { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';

export const Dashboard: React.FC = () => {
  const { address, balance, currency, fetchWalletData, isLoading, error } = useWalletStore();

  useEffect(() => {
    fetchWalletData();
    // Poll every 10 seconds
    const interval = setInterval(fetchWalletData, 10000);
    return () => clearInterval(interval);
  }, [fetchWalletData]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Agent Wallet</h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Address</p>
          {isLoading && !address ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mt-1"></div>
          ) : (
            <p className="font-mono text-lg text-gray-800 break-all">
              {address || 'Connecting...'}
            </p>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-500 uppercase tracking-wide">Balance</p>
          {isLoading && !balance ? (
            <div className="h-8 bg-blue-200 rounded animate-pulse w-1/2 mt-1"></div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-blue-800">{balance || '0.00'}</span>
              <span className="ml-2 text-lg text-blue-600">{currency}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
