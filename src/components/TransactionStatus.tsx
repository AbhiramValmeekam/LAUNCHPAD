import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error';
  message?: string;
  txHash?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, message, txHash }) => {
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-background border border-gray-700 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-3">
        {status === 'pending' && (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-300">{message}</p>
          {txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              View transaction
            </a>
          )}
        </div>
      </div>
    </div>
  );
}; 