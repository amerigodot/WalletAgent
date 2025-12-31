import React from 'react';
import { useWalletStore } from '../store/walletStore';
import type { AuditLogEntry } from '../types';

export const AuditFeed: React.FC = () => {
    const { auditLogs } = useWalletStore();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'text-green-600 bg-green-100';
            case 'FAILED': return 'text-red-600 bg-red-100';
            case 'PENDING': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Log</h3>
            <div className="overflow-y-auto max-h-64 space-y-3">
                {auditLogs.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No activity recorded.</p>
                ) : (
                    auditLogs.map((log: AuditLogEntry) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                            <div>
                                <div className="font-medium text-gray-900">{log.event_type}</div>
                                <div className="text-xs text-gray-500">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                    {log.tx_hash && <span className="ml-2 font-mono text-xs opacity-75 truncate max-w-[100px] inline-block align-bottom">{log.tx_hash}</span>}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                {log.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
