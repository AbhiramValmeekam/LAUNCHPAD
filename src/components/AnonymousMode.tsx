import React from 'react';
import { anonymousService } from '../services/anonymousService';
import { UserX, Clock } from 'lucide-react';

interface AnonymousModeProps {
  onModeSelect: (isAnonymous: boolean) => void;
}

export const AnonymousMode: React.FC<AnonymousModeProps> = ({ onModeSelect }) => {
  const [showStats, setShowStats] = React.useState(false);
  const stats = anonymousService.getAccountStats();
  const hasAccount = anonymousService.hasAnonymousAccount();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onModeSelect(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <UserX className="w-5 h-5 text-cyan-500" />
          <span>Use Anonymously</span>
        </button>

        {hasAccount && (
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        )}
      </div>

      {showStats && stats && (
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Created: {formatDate(stats.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last accessed: {formatDate(stats.lastAccessed)}</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <span className="text-sm text-gray-500">
          No personal information required. Your data stays in your browser.
        </span>
      </div>
    </div>
  );
}; 