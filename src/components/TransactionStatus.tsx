import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error' | 'warning' | 'info';
  message: string;
  txHash?: string;
}

export function TransactionStatus({ status, message, txHash }: TransactionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-500';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      default:
        return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin" />;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${getStatusColor()} flex items-center gap-3 shadow-lg max-w-md`}>
      {getStatusIcon()}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        {txHash && (
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-75 hover:opacity-100 underline"
          >
            View transaction
          </a>
        )}
      </div>
    </div>
  );
} 